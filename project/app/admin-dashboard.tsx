import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@/services/api';
import { MapPin, Phone, Trash2, CheckCircle, ArrowLeft } from 'lucide-react-native';

interface Request {
  id: string;
  prenom?: string;
  nom?: string;
  name?: string;
  telephone: string;
  adresse: string;
  status: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadRequests();
    }, [activeTab])
  );

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (activeTab === 'all') {
        data = await apiClient.getRequests();
      } else {
        data = await apiClient.getRequests(activeTab);
      }
      setRequests(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t('error'));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiClient.updateRequestStatus(id, newStatus);
      const updatedRequests = requests.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      );
      setRequests(updatedRequests);
    } catch (err: any) {
      alert(err.response?.data?.message || t('error'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteRequest(id);
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || t('error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'completed':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('pending');
      case 'accepted':
        return t('accepted');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>Unauthorized</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderRequest = ({ item }: { item: Request }) => {
    const name = item.name || `${item.prenom || ''} ${item.nom || ''}`.trim();

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.requestName}>{name || 'Anonymous'}</Text>
            <Text style={styles.requestTime}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <Text style={styles.detailLabel}>{t('phone')}:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.telephone}`)}>
            <Text style={styles.detailValue}>{item.telephone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestDetails}>
          <Text style={styles.detailLabel}>{t('address')}:</Text>
          <Text style={styles.detailValue}>{item.adresse}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL(`tel:${item.telephone}`)}
          >
            <Phone size={14} color="#fff" />
            <Text style={styles.actionButtonText}>{t('call')}</Text>
          </TouchableOpacity>

          {item.latitude && item.longitude && (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${item.latitude},${item.longitude}`
                )
              }
            >
              <MapPin size={14} color="#fff" />
              <Text style={styles.actionButtonText}>{t('viewOnMap')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              if (confirm(t('deleteConfirm'))) {
                handleDelete(item.id);
              }
            }}
          >
            <Trash2 size={14} color="#ef4444" />
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>

        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => handleStatusChange(item.id, 'accepted')}
          >
            <CheckCircle size={16} color="#fff" />
            <Text style={styles.statusButtonText}>{t('accept')}</Text>
          </TouchableOpacity>
        )}

        {item.status === 'accepted' && (
          <TouchableOpacity
            style={[styles.statusButton, styles.completeButton]}
            onPress={() => handleStatusChange(item.id, 'completed')}
          >
            <CheckCircle size={16} color="#fff" />
            <Text style={styles.statusButtonText}>{t('complete')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('emergencyRequests')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {['all', 'pending', 'accepted', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab === 'all'
                ? t('all')
                : tab === 'pending'
                ? t('pending')
                : tab === 'accepted'
                ? t('accepted')
                : t('completed')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

      {loading ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : requests.length === 0 ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyText}>{t('noRequests')}</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
  },
  tab: {
    marginRight: 12,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomColor: '#ef4444',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#ef4444',
  },
  listContent: {
    padding: 20,
  },
  requestCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  requestDetails: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  statusButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  completeButton: {
    backgroundColor: '#3b82f6',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});
