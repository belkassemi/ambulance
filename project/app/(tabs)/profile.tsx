import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Settings, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('language', lang);
      setCurrentLanguage(lang);
    } catch (err) {
      console.error('Language change error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please log in to view your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile')}</Text>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>{user?.role === 'admin' ? 'Administrator' : 'User'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#ef4444" />
            <Text style={styles.sectionTitle}>{t('settings')}</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t('selectLanguage')}</Text>
            <View style={styles.languageButtons}>
              {['en', 'fr', 'ar'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    currentLanguage === lang && styles.languageButtonActive,
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      currentLanguage === lang && styles.languageButtonTextActive,
                    ]}
                  >
                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {user?.role === 'admin' && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => router.push('/admin-dashboard')}
            >
              <Text style={styles.adminButtonText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <>
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutButtonText}>{t('logout')}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{t('version')}</Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  adminButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopColor: '#1a1a1a',
    borderTopWidth: 1,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
  },
});
