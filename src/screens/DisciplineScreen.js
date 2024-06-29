/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import AppList from 'react-native-app-list';
import { LineChart } from 'react-native-chart-kit';
import AppUsage from 'react-native-app-usage';

const DisciplineScreen = () => {
  const [installedApps, setInstalledApps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [appUsageData, setAppUsageData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    fetchInstalledApps();
    fetchAppUsageData();
  }, []);

  // Fonction pour récupérer la liste des applications installées
  const fetchInstalledApps = async () => {
    try {
      const apps = await AppList.getApps();
      setInstalledApps(apps);
    } catch (error) {
      console.error('Error fetching installed apps:', error);
    }
  };

  // Fonction pour récupérer les données d'utilisation des applications
  const fetchAppUsageData = async () => {
    try {
      const appUsageStats = await AppUsage.getUsageStats({ /* Options ici */ });
      console.log('App usage statistics:', appUsageStats);
      const labels = appUsageStats.map(app => app.packageName.substring(0, 10));
      const data = appUsageStats.map(app => app.usageTime);
      setAppUsageData({
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      });
      checkAppUsageAndApplySanction(appUsageStats);
    } catch (error) {
      console.error('Error fetching app usage data:', error);
    }
  };

  // Fonction pour vérifier l'utilisation des applications et appliquer la sanction si nécessaire
  const checkAppUsageAndApplySanction = (appUsageStats) => {
    const totalUsageTime = appUsageStats.reduce((total, app) => total + app.usageTime, 0);
    const usageThreshold = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
    if (totalUsageTime > usageThreshold) {
      applySanction('limit10Min');
    }
  };

  // Fonction pour ajouter une tâche à la ToDo List
  const addTask = () => {
    if (title.trim() === '') return;

    const newTask = {
      id: String(new Date().getTime()),
      title: title,
      description: description,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
  };

  // Fonction pour marquer une tâche comme complétée ou non complétée
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Fonction pour appliquer une sanction
  const applySanction = async (type) => {
    try {
      switch (type) {
        case 'restrictDay':
          // Implémentation d'une logique de restriction pour une journée
          console.log('Application restreinte pour aujourd\'hui.');
          // Exemple d'une alerte pour informer l'utilisateur
          Alert.alert('Sanction appliquée', 'L\'application est restreinte pour aujourd\'hui.');
          break;
        case 'limit10Min':
          // Implémentation d'une logique pour limiter à 10 minutes par jour
          console.log('Accès limité à 10 minutes par jour.');
          // Exemple d'une alerte pour informer l'utilisateur
          Alert.alert('Sanction appliquée', 'L\'accès est limité à 10 minutes par jour.');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error applying sanction:', error);
      // Exemple d'une alerte en cas d'erreur
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'application de la sanction.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Section ToDo List */}
      <Text style={styles.sectionTitle}>ToDo List</Text>
      <View style={styles.taskInputContainer}>
        <TextInput
          placeholder="Titre de la tâche"
          value={title}
          onChangeText={setTitle}
          style={styles.taskInput}
        />
        <TextInput
          placeholder="Description de la tâche"
          value={description}
          onChangeText={setDescription}
          style={[styles.taskInput, { height: 80 }]}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
            <Text style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
              {item.title}
            </Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />

      {/* Section Statistiques d'utilisation des applications */}
      <Text style={styles.sectionTitle}>Statistiques d'utilisation des applications</Text>
      <LineChart
        data={appUsageData}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#1AA192',
          },
        }}
        bezier
        style={styles.chart}
      />

      {/* Section Sanctions */}
      <Text style={styles.sectionTitle}>Sanctions</Text>
      <TouchableOpacity style={styles.sanctionButton} onPress={() => applySanction('restrictDay')}>
        <Text style={styles.sanctionButtonText}>Restreindre pour aujourd'hui</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sanctionButton} onPress={() => applySanction('limit10Min')}>
        <Text style={styles.sanctionButtonText}>Limite de 10 min par jour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskInputContainer: {
    marginBottom: 20,
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskList: {
    marginBottom: 20,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  sanctionButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  sanctionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DisciplineScreen;