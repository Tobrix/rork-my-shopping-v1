import React, { useRef, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Shop } from "@/types/shop";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { IconComponent } from "@/components/IconComponent";
import { Edit, Trash2, Star } from "lucide-react-native";

interface SwipeableShopItemProps {
  shop: Shop;
  onEdit: (shop: Shop) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function SwipeableShopItem({ shop, onEdit, onDelete, onToggleFavorite }: SwipeableShopItemProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();

  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;
  const deleteScale = useRef(new Animated.Value(0.8)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        
        // Only show delete background when swiping left (negative values)
        if (translationX < 0) {
          const progress = Math.min(Math.abs(translationX) / 100, 1);
          deleteOpacity.setValue(progress);
          deleteScale.setValue(0.8 + (0.2 * progress));
        } else {
          deleteOpacity.setValue(0);
          deleteScale.setValue(0.8);
        }
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      // Only allow right-to-left swipe (negative values)
      if (translationX >= 0) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.timing(deleteOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(deleteScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start();
        return;
      }

      // If swiped more than threshold, complete the deletion
      if (translationX < -120) {
        // Animate all the way to the left edge
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -400,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(deleteOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start(() => {
          onDelete(shop.id);
        });
        return;
      }

      // Otherwise, animate back to original position
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(deleteOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(deleteScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const handleEdit = () => {
    onEdit(shop);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(shop.id);
  };

  // Get shop display data with multilingual support - memoized for performance
  const shopDisplay = useMemo(() => {
    // Check if shop has multilingual data for current language
    const multilingualData = shop.multilingualData?.[language];
    if (multilingualData) {
      return {
        name: multilingualData.name,
        icon: multilingualData.icon,
        color: multilingualData.color,
      };
    }
    return {
      name: shop.name,
      icon: shop.icon,
      color: shop.color || colors.primary,
    };
  }, [shop, language, colors.primary]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
    },
    deleteBackground: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: colors.error,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 30,
      borderRadius: 12,
    },
    itemContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: shopDisplay.color + '20',
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    shopInfo: {
      flex: 1,
    },
    shopName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      marginLeft: 12,
      padding: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.deleteBackground,
          {
            opacity: deleteOpacity,
          }
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: deleteScale }]
          }}
        >
          <Trash2 size={24} color={colors.white} />
        </Animated.View>
      </Animated.View>
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View
          style={[
            styles.itemContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <IconComponent 
                name={shopDisplay.icon} 
                size={20} 
                color={shopDisplay.color} 
              />
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{shopDisplay.name}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
              <Star 
                size={18} 
                color={shop.isFavorite ? "#FFD700" : colors.darkGray}
                fill={shop.isFavorite ? "#FFD700" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <Edit size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}