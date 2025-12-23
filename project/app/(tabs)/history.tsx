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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@/services/api';
import { MapPin, Phone, Trash2 } from 'lucide-react-native';

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

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.getRequests();
      setRequests(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t('error'));
      setRequests([]);
    } finally {
      setLoading(false);
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

  const renderRequest = ({ item }: { item: Request }) => {
    const name = item.name || `${item.prenom || ''} ${item.nom || ''}`.trim();

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View>
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
            <Phone size={16} color="#fff" />
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
              <MapPin size={16} color="#fff" />
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
            <Trash2 size={16} color="#ef4444" />
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
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
      <View style={styles.header}>
        <Text style={styles.title}>{t('history')}</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isAuthenticated ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please log in to view your history</Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noRequests')}</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.1}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
