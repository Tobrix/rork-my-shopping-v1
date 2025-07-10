import React, { useState, useCallback, useMemo } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView
} from "react-native";
import { useExpenseStore } from "@/store/expenseStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { ShopForm } from "@/components/ShopForm";
import { SwipeableShopItem } from "@/components/SwipeableShopItem";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Shop } from "@/types/shop";
import { Plus, RotateCcw } from "lucide-react-native";

export default function ShopsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { 
    shops,
    settings,
    addShop, 
    updateShop, 
    deleteShop, 
    toggleShopFavorite,
    resetShopsToDefault
  } = useExpenseStore();
  
  const [showShopForm, setShowShopForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | undefined>(undefined);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Get visible shops based on current language and custom shops with more robust filtering
  const allShops = useMemo(() => {
    const currentLanguage = settings.language || 'en';
    
    return shops.filter(shop => {
      // Always show custom shops
      if (shop.isCustom === true) {
        return true;
      }
      
      // For system shops, only show if language matches exactly
      if (shop.language === currentLanguage && shop.isOriginal === true) {
        return true;
      }
      
      // Don't show shops from other languages
      return false;
    });
  }, [shops, settings.language]);
  
  // Sort shops alphabetically by name
  const sortShopsAlphabetically = useCallback((shops: Shop[]) => {
    return [...shops].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  
  const { favoriteShops, customShops, systemShops } = useMemo(() => {
    const favorites = sortShopsAlphabetically(allShops.filter(shop => shop.isFavorite === true));
    const customs = sortShopsAlphabetically(allShops.filter(shop => shop.isCustom === true));
    const systems = sortShopsAlphabetically(allShops.filter(shop => shop.isCustom !== true));
    
    return {
      favoriteShops: favorites,
      customShops: customs,
      systemShops: systems
    };
  }, [allShops, sortShopsAlphabetically]);

  const handleAddShop = useCallback((shopData: Omit<Shop, "id">) => {
    addShop(shopData);
  }, [addShop]);

  const handleEditShop = useCallback((shop: Shop) => {
    setEditingShop(shop);
    setShowShopForm(true);
  }, []);

  const handleUpdateShop = useCallback((shopData: Omit<Shop, "id">) => {
    if (editingShop) {
      updateShop({ ...shopData, id: editingShop.id });
    }
  }, [editingShop, updateShop]);

  const handleDeleteShop = useCallback((id: string) => {
    deleteShop(id);
  }, [deleteShop]);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleShopFavorite(id);
  }, [toggleShopFavorite]);

  const handleResetShops = useCallback(() => {
    resetShopsToDefault();
    setShowResetConfirm(false);
  }, [resetShopsToDefault]);

  const handleCloseShopForm = useCallback(() => {
    setShowShopForm(false);
    setEditingShop(undefined);
  }, []);

  const handleShowAddShop = useCallback(() => {
    setEditingShop(undefined);
    setShowShopForm(true);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.lightGray,
    },
    resetButtonText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 6,
    },
    shopsList: {
      paddingHorizontal: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.darkGray,
      textAlign: "center",
      marginBottom: 24,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    emptyButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {allShops.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Custom Shops - Now at the top */}
            {customShops.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t("customShops")}</Text>
                </View>
                <View style={styles.shopsList}>
                  {customShops.map((shop) => (
                    <SwipeableShopItem
                      key={`custom-${shop.id}-${shop.updatedAt || shop.createdAt}`}
                      shop={shop}
                      onEdit={() => handleEditShop(shop)}
                      onDelete={() => handleDeleteShop(shop.id)}
                      onToggleFavorite={() => handleToggleFavorite(shop.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Favorite Shops */}
            {favoriteShops.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t("favorites")}</Text>
                </View>
                <View style={styles.shopsList}>
                  {favoriteShops.map((shop) => (
                    <SwipeableShopItem
                      key={`favorite-${shop.id}-${shop.updatedAt || shop.createdAt}`}
                      shop={shop}
                      onEdit={() => handleEditShop(shop)}
                      onDelete={() => handleDeleteShop(shop.id)}
                      onToggleFavorite={() => handleToggleFavorite(shop.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* System Shops */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t("systemShops")}</Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => setShowResetConfirm(true)}
                >
                  <RotateCcw size={16} color={colors.text} />
                  <Text style={styles.resetButtonText}>{t("resetToDefaults")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.shopsList}>
                {systemShops.map((shop) => (
                  <SwipeableShopItem
                    key={`system-${shop.id}-${shop.updatedAt || shop.createdAt}`}
                    shop={shop}
                    onEdit={() => handleEditShop(shop)}
                    onDelete={() => handleDeleteShop(shop.id)}
                    onToggleFavorite={() => handleToggleFavorite(shop.id)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("noShops")}</Text>
            <Text style={styles.emptySubtext}>{t("addShop")}</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleShowAddShop}
            >
              <Plus size={20} color={colors.white} />
              <Text style={styles.emptyButtonText}>{t("addShop")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Floating Action Button - only show when there are shops */}
      {allShops.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleShowAddShop}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Shop Form Modal */}
      {showShopForm && (
        <ShopForm
          visible={showShopForm}
          shop={editingShop}
          onSave={editingShop ? handleUpdateShop : handleAddShop}
          onClose={handleCloseShopForm}
        />
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        visible={showResetConfirm}
        title={t("resetShops")}
        message={t("resetShopsConfirm")}
        onConfirm={handleResetShops}
        onCancel={() => setShowResetConfirm(false)}
      />
    </View>
  );
}