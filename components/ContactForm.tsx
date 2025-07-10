import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
  Dimensions,
  Animated
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { X, ChevronDown } from "lucide-react-native";

interface ContactFormProps {
  visible: boolean;
  onClose: () => void;
  slideMode?: boolean;
  bottomSlide?: boolean;
}

export function ContactForm({ visible, onClose, slideMode = false, bottomSlide = false }: ContactFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Animation for slide mode
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Animation for bottom slide mode
  const bottomSlideAnim = useRef(new Animated.Value(0)).current;
  const bottomBackdropAnim = useRef(new Animated.Value(0)).current;

  // Enhanced subject picker modal animation
  const subjectModalFadeAnim = useRef(new Animated.Value(0)).current;
  const subjectModalSlideAnim = useRef(new Animated.Value(50)).current;

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.85;

  React.useEffect(() => {
    if (slideMode && visible) {
      // Slide in from right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (slideMode && !visible) {
      // Reset position
      slideAnim.setValue(Dimensions.get('window').width);
      scaleAnim.setValue(0.95);
    }
  }, [visible, slideMode]);

  React.useEffect(() => {
    if (bottomSlide && visible) {
      // Bottom slide animation
      bottomSlideAnim.setValue(modalHeight);
      bottomBackdropAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(bottomSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBackdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, bottomSlide, modalHeight]);

  // Enhanced subject picker animation
  React.useEffect(() => {
    if (showSubjectPicker) {
      subjectModalFadeAnim.setValue(0);
      subjectModalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(subjectModalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(subjectModalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSubjectPicker]);

  const subjects = [
    { key: 'bugReport', label: t("bugReport") },
    { key: 'featureRequest', label: t("featureRequest") },
    { key: 'generalQuestion', label: t("generalQuestion") },
    { key: 'other', label: t("other") },
  ];

  const handleDescriptionFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleSend = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !subject || !description.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const selectedSubjectLabel = subjects.find(s => s.key === subject)?.label || subject;
    
    // Simple email body with just name and message in the selected language
    const emailBody = `${t("firstName")}: ${firstName}
${t("lastName")}: ${lastName}

${description}`;
    
    // Subject is just the selected subject without "App Support:" prefix
    const mailtoUrl = `mailto:tobrixweb@gmail.com?subject=${encodeURIComponent(selectedSubjectLabel)}&body=${encodeURIComponent(emailBody)}`;
    
    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
        Alert.alert(t("messageSent"), "Your email client has been opened with the message.");
        handleClose();
      } else {
        Alert.alert("Error", "No email client found on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open email client");
    }
  };

  const handleClose = () => {
    if (slideMode) {
      // Slide out to right
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').width,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        resetForm();
        onClose();
      });
    } else if (bottomSlide) {
      // Bottom slide out
      Animated.parallel([
        Animated.timing(bottomSlideAnim, {
          toValue: modalHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBackdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        resetForm();
        onClose();
      });
    } else {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSubject("");
    setDescription("");
  };

  const handleSubjectPickerClose = () => {
    Animated.parallel([
      Animated.timing(subjectModalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(subjectModalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSubjectPicker(false);
    });
  };

  // Get animation type based on platform with proper typing
  const getModalAnimationType = (): "none" | "slide" | "fade" => {
    return slideMode || bottomSlide ? "none" : (Platform.OS === 'web' ? "slide" : "slide");
  };

  // Get presentation style for iOS to slide from right
  const getModalPresentationStyle = () => {
    if (Platform.OS === 'ios' && !slideMode && !bottomSlide) {
      return 'pageSheet';
    }
    return undefined;
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: slideMode ? "transparent" : bottomSlide ? "transparent" : "rgba(0, 0, 0, 0.5)",
    },
    // Bottom slide container
    bottomSlideContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    bottomSlideBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    bottomSlideContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: modalHeight,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 20,
    },
    bottomSlideHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 24,
      paddingTop: Platform.OS === 'ios' ? 40 : 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    bottomSlideTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    bottomSlideCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    bottomSlideScrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    // Slide mode container
    slideContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: colors.background,
      zIndex: 2000,
      shadowColor: colors.black,
      shadowOffset: { width: -5, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 20,
    },
    slideHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    slideTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    slideCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    slideScrollContent: {
      padding: 20,
    },
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      margin: 20,
      maxHeight: "90%",
    },
    scrollContent: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    subjectSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    placeholder: {
      color: colors.darkGray,
    },
    sendButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 18,
      alignItems: "center",
      marginTop: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    sendButtonDisabled: {
      backgroundColor: colors.darkGray,
      shadowOpacity: 0,
      elevation: 0,
    },
    sendButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
    // Enhanced subject picker modal - bottom slide like iOS
    pickerModalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    pickerModalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "50%",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    pickerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    subjectItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedSubjectItem: {
      backgroundColor: colors.primary + '10',
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    subjectItemText: {
      fontSize: 14,
      color: colors.text,
    },
    selectedSubjectItemText: {
      fontWeight: "600",
      color: colors.primary,
    },
  });

  const canSend = firstName.trim() && lastName.trim() && email.trim() && subject && description.trim();
  const selectedSubjectLabel = subjects.find(s => s.key === subject)?.label;

  if (bottomSlide) {
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={handleClose}
        presentationStyle="overFullScreen"
      >
        <View style={styles.bottomSlideContainer}>
          <Animated.View 
            style={[
              styles.bottomSlideBackdrop,
              {
                opacity: bottomBackdropAnim,
              }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={handleClose}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.bottomSlideContent,
              {
                transform: [{ translateY: bottomSlideAnim }],
              }
            ]}
          >
            <View style={styles.bottomSlideHeader}>
              <Text style={styles.bottomSlideTitle}>{t("techSupport")}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.bottomSlideCloseButton}>
                <X size={20} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView 
                ref={scrollViewRef}
                contentContainerStyle={styles.bottomSlideScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("firstName")}</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder={t("firstName")}
                    placeholderTextColor={colors.darkGray}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("lastName")}</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder={t("lastName")}
                    placeholderTextColor={colors.darkGray}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("email")}</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("email")}
                    placeholderTextColor={colors.darkGray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("subject")}</Text>
                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowSubjectPicker(true)}
                  >
                    <View style={styles.subjectSelector}>
                      <Text style={selectedSubjectLabel ? { color: colors.text } : styles.placeholder}>
                        {selectedSubjectLabel || t("selectSubject")}
                      </Text>
                      <ChevronDown size={20} color={colors.darkGray} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("description")}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t("description")}
                    placeholderTextColor={colors.darkGray}
                    multiline
                    onFocus={handleDescriptionFocus}
                  />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.sendButton, 
                    !canSend && styles.sendButtonDisabled
                  ]} 
                  onPress={handleSend}
                  disabled={!canSend}
                >
                  <Text style={styles.sendButtonText}>{t("send")}</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>

        {/* Enhanced Subject Picker Modal */}
        {showSubjectPicker && (
          <Modal
            visible={showSubjectPicker}
            animationType="none"
            transparent={true}
            onRequestClose={handleSubjectPickerClose}
          >
            <TouchableOpacity 
              style={styles.pickerModalContainer}
              activeOpacity={1}
              onPress={handleSubjectPickerClose}
            >
              <Animated.View 
                style={[
                  styles.pickerModalContent,
                  {
                    opacity: subjectModalFadeAnim,
                    transform: [{ translateY: subjectModalSlideAnim }],
                  }
                ]}
              >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>{t("selectSubject")}</Text>
                    <TouchableOpacity onPress={handleSubjectPickerClose}>
                      <X size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                  </View>
                  {subjects.map((item) => (
                    <TouchableOpacity
                      key={`contact-subject-${item.key}`}
                      style={[
                        styles.subjectItem,
                        item.key === subject && styles.selectedSubjectItem
                      ]}
                      onPress={() => {
                        setSubject(item.key);
                        handleSubjectPickerClose();
                      }}
                    >
                      <Text 
                        style={[
                          styles.subjectItemText,
                          item.key === subject && styles.selectedSubjectItemText
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        )}
      </Modal>
    );
  }

  if (slideMode) {
    return (
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.slideContainer,
              {
                transform: [
                  { translateX: slideAnim },
                  { scale: scaleAnim }
                ],
              }
            ]}
          >
            <View style={styles.slideHeader}>
              <Text style={styles.slideTitle}>{t("techSupport")}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.slideCloseButton}>
                <X size={20} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView 
                ref={scrollViewRef}
                contentContainerStyle={styles.slideScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("firstName")}</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder={t("firstName")}
                    placeholderTextColor={colors.darkGray}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("lastName")}</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder={t("lastName")}
                    placeholderTextColor={colors.darkGray}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("email")}</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("email")}
                    placeholderTextColor={colors.darkGray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("subject")}</Text>
                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowSubjectPicker(true)}
                  >
                    <View style={styles.subjectSelector}>
                      <Text style={selectedSubjectLabel ? { color: colors.text } : styles.placeholder}>
                        {selectedSubjectLabel || t("selectSubject")}
                      </Text>
                      <ChevronDown size={20} color={colors.darkGray} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("description")}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t("description")}
                    placeholderTextColor={colors.darkGray}
                    multiline
                    onFocus={handleDescriptionFocus}
                  />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.sendButton, 
                    !canSend && styles.sendButtonDisabled
                  ]} 
                  onPress={handleSend}
                  disabled={!canSend}
                >
                  <Text style={styles.sendButtonText}>{t("send")}</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>

        {/* Enhanced Subject Picker Modal */}
        {showSubjectPicker && (
          <Modal
            visible={showSubjectPicker}
            animationType="none"
            transparent={true}
            onRequestClose={handleSubjectPickerClose}
          >
            <TouchableOpacity 
              style={styles.pickerModalContainer}
              activeOpacity={1}
              onPress={handleSubjectPickerClose}
            >
              <Animated.View 
                style={[
                  styles.pickerModalContent,
                  {
                    opacity: subjectModalFadeAnim,
                    transform: [{ translateY: subjectModalSlideAnim }],
                  }
                ]}
              >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>{t("selectSubject")}</Text>
                    <TouchableOpacity onPress={handleSubjectPickerClose}>
                      <X size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                  </View>
                  {subjects.map((item) => (
                    <TouchableOpacity
                      key={`contact-subject-${item.key}`}
                      style={[
                        styles.subjectItem,
                        item.key === subject && styles.selectedSubjectItem
                      ]}
                      onPress={() => {
                        setSubject(item.key);
                        handleSubjectPickerClose();
                      }}
                    >
                      <Text 
                        style={[
                          styles.subjectItemText,
                          item.key === subject && styles.selectedSubjectItemText
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType={getModalAnimationType()}
      transparent={true}
      presentationStyle={getModalPresentationStyle()}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>{t("techSupport")}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={24} color={colors.darkGray} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("firstName")}</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={t("firstName")}
                  placeholderTextColor={colors.darkGray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("lastName")}</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={t("lastName")}
                  placeholderTextColor={colors.darkGray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("email")}</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t("email")}
                  placeholderTextColor={colors.darkGray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("subject")}</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setShowSubjectPicker(true)}
                >
                  <View style={styles.subjectSelector}>
                    <Text style={selectedSubjectLabel ? { color: colors.text } : styles.placeholder}>
                      {selectedSubjectLabel || t("selectSubject")}
                    </Text>
                    <ChevronDown size={20} color={colors.darkGray} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("description")}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t("description")}
                  placeholderTextColor={colors.darkGray}
                  multiline
                  onFocus={handleDescriptionFocus}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  !canSend && styles.sendButtonDisabled
                ]} 
                onPress={handleSend}
                disabled={!canSend}
              >
                <Text style={styles.sendButtonText}>{t("send")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Enhanced Subject Picker Modal */}
        {showSubjectPicker && (
          <Modal
            visible={showSubjectPicker}
            animationType="none"
            transparent={true}
            onRequestClose={handleSubjectPickerClose}
          >
            <TouchableOpacity 
              style={styles.pickerModalContainer}
              activeOpacity={1}
              onPress={handleSubjectPickerClose}
            >
              <Animated.View 
                style={[
                  styles.pickerModalContent,
                  {
                    opacity: subjectModalFadeAnim,
                    transform: [{ translateY: subjectModalSlideAnim }],
                  }
                ]}
              >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>{t("selectSubject")}</Text>
                    <TouchableOpacity onPress={handleSubjectPickerClose}>
                      <X size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                  </View>
                  {subjects.map((item) => (
                    <TouchableOpacity
                      key={`contact-subject-${item.key}`}
                      style={[
                        styles.subjectItem,
                        item.key === subject && styles.selectedSubjectItem
                      ]}
                      onPress={() => {
                        setSubject(item.key);
                        handleSubjectPickerClose();
                      }}
                    >
                      <Text 
                        style={[
                          styles.subjectItemText,
                          item.key === subject && styles.selectedSubjectItemText
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </Modal>
  );
}