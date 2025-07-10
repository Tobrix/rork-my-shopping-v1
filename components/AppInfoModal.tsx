import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Platform,
  Linking
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLogo } from "@/components/AppLogo";
import { X, Instagram } from "lucide-react-native";

interface AppInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AppInfoModal({ visible, onClose }: AppInfoModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!visible) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleInstagramPress = async () => {
    const url = "https://www.instagram.com/tobias_kubanek/";
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open Instagram URL:", error);
    }
  };

  // Get animation type based on platform with proper typing
  const getModalAnimationType = (): "none" | "slide" | "fade" => {
    return Platform.OS === 'web' ? "fade" : "fade";
  };

  // Get presentation style for iOS
  const getModalPresentationStyle = () => {
    if (Platform.OS === 'ios') {
      return 'overFullScreen';
    }
    return undefined;
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 5,
    },
    logoContainer: {
      marginBottom: 16,
    },
    appName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    appVersion: {
      fontSize: 16,
      color: colors.darkGray,
      marginBottom: 8,
      textAlign: "center",
    },
    currentTime: {
      fontSize: 14,
      color: colors.primary,
      marginBottom: 12,
      textAlign: "center",
      fontFamily: 'monospace',
    },
    appDeveloper: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 12,
    },
    instagramContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.lightGray,
    },
    instagramIcon: {
      marginRight: 8,
    },
    instagramText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType={getModalAnimationType()}
      transparent={true}
      presentationStyle={getModalPresentationStyle()}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("appInfo")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.logoContainer}>
            <AppLogo size={80} />
          </View>
          
          <Text style={styles.appName}>{t("appName")}</Text>
          <Text style={styles.appVersion}>{t("version")}</Text>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.appDeveloper}>Tobrix</Text>
          
          <TouchableOpacity 
            style={styles.instagramContainer}
            onPress={handleInstagramPress}
            activeOpacity={0.7}
          >
            <Instagram size={20} color={colors.primary} style={styles.instagramIcon} />
            <Text style={styles.instagramText}>@tobias_kubanek</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}