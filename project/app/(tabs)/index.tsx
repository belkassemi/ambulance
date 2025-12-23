import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Heart, Users, Ambulance } from 'lucide-react-native';
import LoginPromptModal from '@/components/LoginPromptModal';
import AnonymousSOSModal from '@/components/AnonymousSOSModal';
import { getCurrentLocation } from '@/services/location';
import { apiClient } from '@/services/api';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);
  const [sosLoading, setSOSLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.replace('/admin-dashboard');
    }
  }, [isAuthenticated, user]);

  const handleSOSPress = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (user?.role === 'admin') {
      router.push('/admin-dashboard');
      return;
    }

    await handleAuthenticatedSOS();
  };

  const handleAuthenticatedSOS = async () => {
    try {
      setSOSLoading(true);

      let location = null;
      try {
        location = await getCurrentLocation();
      } catch (err) {
        console.warn('Location fetch warning:', err);
      }

      const data = {
        ...(location && {
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      };

      await apiClient.createAuthenticatedRequest(data);

      await Linking.openURL('tel:+212773628498');

      alert(t('authenticatedRequest'));
    } catch (err: any) {
      alert(err.response?.data?.message || t('error'));
    } finally {
      setSOSLoading(false);
    }
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    router.push('/(auth)/login');
  };

  const handleAnonymousOpen = () => {
    setShowLoginPrompt(false);
    setShowAnonymousForm(true);
  };

  const handleAnonymousSuccess = () => {
    alert(t('anonymousRequest'));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {isAuthenticated ? `Hello, ${user?.name}` : 'Welcome to Assistance KMY'}
          </Text>
          <Text style={styles.subGreeting}>Emergency ambulance services</Text>
        </View>

        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={[styles.sosButton, sosLoading && styles.sosButtonLoading]}
            onPress={handleSOSPress}
            disabled={sosLoading || isLoading}
          >
            {sosLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                <Text style={styles.sosText}>{t('sosButton')}</Text>
                <Text style={styles.sosSubText}>{t('sosDescription')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Our Services</Text>

          <View style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              <Heart size={32} color="#ef4444" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{t('homecare')}</Text>
              <Text style={styles.serviceDescription}>Professional home health care services</Text>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              <Ambulance size={32} color="#ef4444" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{t('medicalVehicles')}</Text>
              <Text style={styles.serviceDescription}>Emergency ambulance services available 24/7</Text>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              <Users size={32} color="#ef4444" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{t('nurses')}</Text>
              <Text style={styles.serviceDescription}>Experienced nursing professionals on call</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Emergency Contact</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+212773628498')}>
            <Text style={styles.phoneNumber}>+212 773 628 498</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoginPromptModal
        visible={showLoginPrompt}
        onLogin={handleLoginRedirect}
        onAnonymous={handleAnonymousOpen}
      />

      <AnonymousSOSModal
        visible={showAnonymousForm}
        onClose={() => setShowAnonymousForm(false)}
        onSuccess={handleAnonymousSuccess}
      />
    </SafeAreaView>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#999',
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sosButton: {
    backgroundColor: '#ef4444',
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sosButtonLoading: {
    opacity: 0.8,
  },
  sosText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  sosSubText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.9,
  },
  servicesContainer: {
    marginBottom: 30,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#999',
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
  },
});
