import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../App';
import { GET_WEATHER_API } from '../api';

type Props = StackScreenProps<RootStackParams, 'Home'>;

type DashboardItem = {
  id: string;
  title: string;
  description: string;
};

const DASHBOARD_DATA: DashboardItem[] = [
  { id: '1', title: 'Daily Steps', description: '8,432 / 10,000 steps' },
  { id: '2', title: 'Active Minutes', description: '45 mins of cardio' },
  { id: '3', title: 'Water Intake', description: '2.1L / 3L today' },
  { id: '4', title: 'Sleep Quality', description: '7h 30m - Good' },
  { id: '5', title: 'Heart Rate', description: '68 BPM (Resting)' },
];

const HomeScreen = ({ route }: Props) => {
  const [weather, setWeather] = useState<string>('Loading...');
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {


    const loadWeather = async () => {
      try {
        const res = await fetch(GET_WEATHER_API);
        const resJson = await res.json();

        const temp = resJson?.main?.temp;
        if (temp) {

          const celsius = Math.round(temp - 273.15);
          setWeather(`${celsius}°C - ${resJson.weather?.[0]?.description ?? 'Clear'}`);
        } else {
          setWeather('No data');
        }
      } catch (error) {
        setWeather('No data');
      }
    };

    loadWeather();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return DASHBOARD_DATA;
    return DASHBOARD_DATA.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleItemPress = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>User: {route.params?.name || 'Guest'}</Text>
        <Text style={styles.weatherText}>Weather: {weather}</Text>
      </View>

      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder="Search activities..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        ref={flatListRef}
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleItemPress()}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: '#1c1c1e',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2c2c2e',
    marginHorizontal: 20,
    marginVertical: 15,
    fontSize: 16,
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#aaa',
  },
});

export { HomeScreen };
