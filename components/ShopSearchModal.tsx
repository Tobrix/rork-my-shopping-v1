import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  TextInput,
  Animated,
  Platform
} from "react-native";
import { useExpenseStore } from "@/store/expenseStore";
import { Shop } from "@/types/shop";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { IconComponent } from "@/components/IconComponent";
import { X, Search, Star } from "lucide-react-native";

interface ShopSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectShop: (shop: Shop) => void;
  selectedShopId?: string;
}

type HeaderItem = {
  type: 'header';
  title: string;
  count: number;
  id: string;
};

type ListItem = Shop | HeaderItem;

// Type guard to check if item is HeaderItem
function isHeaderItem(item: ListItem): item is HeaderItem {
  return 'type' in item && item.type === 'header';
}

export function ShopSearchModal({ visible, onClose, onSelectShop, selectedShopId }: ShopSearchModalProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const { shops, settings } = useExpenseStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  // Enhanced modal animation
  const modalFadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(50)).current;

  // Reset search when modal opens but don't auto-focus
  useEffect(() => {
    if (visible) {
      setSearchQuery("");
      // Enhanced modal animation
      modalFadeAnim.setValue(0);
      modalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(modalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Enhanced filter and sort shops: Favorites first, then custom shops, then system shops
  const filteredShops = useMemo(() => {
    const currentLanguage = settings.language;
    const languageShops = shops.filter(shop => 
      shop.language === currentLanguage || shop.isCustom
    );
    
    const filtered = languageShops.filter(shop => {
      // Check multilingual data for current language
      const multilingualData = shop.multilingualData?.[language];
      const displayName = multilingualData?.name || shop.name;
      return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    // Enhanced sorting: Favorites first, then custom shops, then system shops
    return filtered.sort((a, b) => {
      // First priority: Favorites
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      // Second priority: Custom shops vs system shops
      if (a.isFavorite === b.isFavorite) {
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;
      }
      
      // Third priority: Alphabetical within same category
      const aMultilingualData = a.multilingualData?.[language];
      const bMultilingualData = b.multilingualData?.[language];
      const aName = aMultilingualData?.name || a.name;
      const bName = bMultilingualData?.name || b.name;
      return aName.localeCompare(bName);
    });
  }, [shops, settings.language, language, searchQuery]);

  // Group shops for better display organization
  const groupedShops = useMemo(() => {
    const favorites = filteredShops.filter(shop => shop.isFavorite);
    const customShops = filteredShops.filter(shop => !shop.isFavorite && shop.isCustom);
    const systemShops = filteredShops.filter(shop => !shop.isFavorite && !shop.isCustom);
    
    return {
      favorites,
      customShops,
      systemShops,
      all: filteredShops
    };
  }, [filteredShops]);

  const handleSelectShop = (shop: Shop) => {
    onSelectShop(shop);
    setSearchQuery("");
    handleClose();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSearchQuery("");
      onClose();
    });
  };

  const handleSearchFocus = () => {
    // Only focus when user explicitly taps the search field
    searchInputRef.current?.focus();
  };

  const getShopDisplayData = (shop: Shop) => {
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
      color: shop.color || "#3B82F6",
    };
  };

  const renderShopItem = ({ item }: { item: Shop }) => {
    const shopDisplay = getShopDisplayData(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.shopItem,
          item.id === selectedShopId && styles.selectedShopItem
        ]}
        onPress={() => handleSelectShop(item)}
      >
        <View style={[styles.shopItemIcon, { backgroundColor: shopDisplay.color + '20' }]}>
          <IconComponent name={shopDisplay.icon} size={18} color={shopDisplay.color} />
        </View>
        <View style={styles.shopItemContent}>
          <Text 
            style={[
              styles.shopItemText,
              item.id === selectedShopId && styles.selectedShopItemText
            ]}
          >
            {shopDisplay.name}
          </Text>
          {item.isFavorite && (
            <Star size={14} color="#FFD700" fill="#FFD700" style={styles.favoriteIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string, count: number) => {
    if (count === 0) return null;
    
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <Text style={styles.sectionHeaderCount}>({count})</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    // Enhanced modal container with higher z-index for web
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: Platform.select({
        web: 9999999999,
        default: 100000,
      }),
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "80%",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 20,
      zIndex: Platform.select({
        web: 9999999999,
        default: 100000,
      }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 16, // Reduced font size
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      margin: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    // Section headers for organized display
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionHeaderText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.darkGray,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sectionHeaderCount: {
      fontSize: 12,
      color: colors.darkGray,
      marginLeft: 8,
    },
    shopItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedShopItem: {
      backgroundColor: colors.primary + '10',
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    shopItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    shopItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    shopItemText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    selectedShopItemText: {
      fontWeight: "700",
      color: colors.primary,
    },
    favoriteIcon: {
      marginLeft: 8,
    },
    emptyContainer: {
      padding: 32,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: colors.darkGray,
      textAlign: "center",
    },
  });

  // Prepare data for FlatList with sections
  const flatListData = useMemo(() => {
    if (searchQuery) {
      // When searching, show all results without sections
      return groupedShops.all;
    }

    // When not searching, show organized sections
    const data: ListItem[] = [];
    
    if (groupedShops.favorites.length > 0) {
      data.push({ 
        type: 'header', 
        title: t("favorites"), 
        count: groupedShops.favorites.length,
        id: 'header-favorites'
      });
      data.push(...groupedShops.favorites);
    }
    
    if (groupedShops.customShops.length > 0) {
      data.push({ 
        type: 'header', 
        title: t("myShops"), 
        count: groupedShops.customShops.length,
        id: 'header-custom'
      });
      data.push(...groupedShops.customShops);
    }
    
    if (groupedShops.systemShops.length > 0) {
      data.push({ 
        type: 'header', 
        title: t("systemShops"), 
        count: groupedShops.systemShops.length,
        id: 'header-system'
      });
      data.push(...groupedShops.systemShops);
    }
    
    return data;
  }, [groupedShops, searchQuery, t]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (isHeaderItem(item)) {
      return renderSectionHeader(item.title, item.count);
    }
    return renderShopItem({ item });
  };

  const getItemKey = (item: ListItem, index: number): string => {
    if (isHeaderItem(item)) {
      return item.id;
    }
    return `shop-${item.id}-${item.updatedAt || item.createdAt}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableOpacity 
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: modalFadeAnim,
              transform: [{ translateY: modalSlideAnim }],
            }
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("selectShop")}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={20} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearchFocus}>
              <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("searchShops")}
                placeholderTextColor={colors.darkGray}
                autoFocus={false}
              />
            </TouchableOpacity>

            {flatListData.length > 0 ? (
              <FlatList
                data={flatListData}
                keyExtractor={getItemKey}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? t("noShopsFoundFor").replace("{query}", searchQuery) : t("noShopsAvailable")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}