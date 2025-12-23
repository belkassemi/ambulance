import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface LoginPromptModalProps {
  visible: boolean;
  onLogin: () => void;
  onAnonymous: () => void;
}

export default function LoginPromptModal({ visible, onLogin, onAnonymous }: LoginPromptModalProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>{t('loginRequired')}</Text>
            <Text style={styles.message}>Choose how you want to send an emergency request</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
              <Text style={styles.primaryButtonText}>{t('loginOrContinue')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onAnonymous}>
              <Text style={styles.secondaryButtonText}>{t('continueAnonymously')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
