import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/services/api';
import { getCurrentLocation } from '@/services/location';
import { Linking } from 'react-native';

interface AnonymousSOSModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AnonymousSOSModal({ visible, onClose, onSuccess }: AnonymousSOSModalProps) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSOS = async () => {
    try {
      setError('');
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim()) {
        setError(t('required'));
        return;
      }

      setLoading(true);

      let location = null;
      try {
        location = await getCurrentLocation();
      } catch (err) {
        console.warn('Location fetch warning:', err);
      }

      const data = {
        prenom: firstName,
        nom: lastName,
        telephone: phone,
        adresse: address,
        ...(location && {
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      };

      await apiClient.createAnonymousRequest(data);

      setFirstName('');
      setLastName('');
      setPhone('');
      setAddress('');

      await Linking.openURL('tel:+212773628498');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('anonymousRequest')}</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
              style={styles.input}
              placeholder={t('firstName')}
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder={t('lastName')}
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder={t('phone')}
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('address')}
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              editable={!loading}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.sosButton, loading && styles.buttonDisabled]}
              onPress={handleSOS}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <>
                  <Text style={styles.sosButtonText}>{t('sosButton')}</Text>
                  <Text style={styles.sosButtonSubText}>{t('sosDescription')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 28,
    color: '#999',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  sosButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  sosButtonSubText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
});
