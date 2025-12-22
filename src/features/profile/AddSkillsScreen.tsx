import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Checkbox, Text, useTheme, Appbar } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

const availableSkills = [
  'Interior Design',
  'Project Management',
  'CAD Drawing',
  '3D Modeling',
  'Space Planning',
  'Color Theory',
  'Lighting Design',
  'Furniture Design',
];

const AddSkillsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = () => {
    console.log('Selected skills:', selectedSkills);
    navigation.goBack();
  };

  const handleBackPress = () => {
    if (selectedSkills.length > 0) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Select Your Skills" />
        {selectedSkills.length > 0 && (
          <Text style={styles.changesText}>{selectedSkills.length} selected</Text>
        )}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose the skills that match your expertise. You can update this anytime.
        </Text>
        
        <View style={styles.skillsContainer}>
          {availableSkills.map(skill => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillItem,
                  isSelected && styles.skillItemSelected
                ]}
                onPress={() => handleToggleSkill(skill)}
                activeOpacity={0.7}
              >
                <View style={styles.skillContent}>
                  <Text style={[
                    styles.skillLabel,
                    isSelected && styles.skillLabelSelected
                  ]}>
                    {skill}
                  </Text>
                  <Checkbox.Android
                    status={isSelected ? 'checked' : 'unchecked'}
                    color={theme.colors.primary}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSkills.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected Skills ({selectedSkills.length}):</Text>
            <View style={styles.selectedSkillsList}>
              {selectedSkills.map(skill => (
                <View key={skill} style={styles.selectedSkillTag}>
                  <Text style={styles.selectedSkillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          mode="outlined" 
          onPress={handleBackPress}
          style={[styles.button, styles.cancelButton]}
          labelStyle={styles.cancelButtonLabel}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={[styles.button, styles.submitButton]}
          disabled={selectedSkills.length === 0}
          contentStyle={styles.submitButtonContent}
        >
          Save Skills
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  changesText: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  skillsContainer: {
    marginBottom: 24,
  },
  skillItem: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skillItemSelected: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  skillContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillLabel: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  skillLabelSelected: {
    color: '#1976d2',
    fontWeight: '500',
  },
  selectedContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1976d2',
  },
  selectedSkillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSkillTag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1976d2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedSkillText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  cancelButton: {
    borderColor: '#999',
  },
  cancelButtonLabel: {
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#1976d2',
  },
  submitButtonContent: {
    height: 48,
  },
});

export default AddSkillsScreen;