import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Checkbox, Text, useTheme, Appbar, ActivityIndicator } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useGetAllSkillsQuery, useGetUserSkillsQuery, useUpdateSkillsMutation, Skill } from './skillsApiSlice';

const AddSkillsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  
  // API hooks
  const { data: allSkills = [], isLoading: isLoadingSkills, error: skillsError, refetch } = useGetAllSkillsQuery();
  const { data: userSkills = [], isLoading: isLoadingUserSkills } = useGetUserSkillsQuery();
  const [updateSkills, { isLoading: isUpdating }] = useUpdateSkillsMutation();
  
  // Initialize selected skills when user skills are loaded
  useEffect(() => {
    if (userSkills.length > 0) {
      const userSkillIds = userSkills.map(skill => skill.id);
      setSelectedSkillIds(userSkillIds);
    }
  }, [userSkills]);

  const handleToggleSkill = (skillId: number) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };
  
  const hasChanges = () => {
    const currentUserSkillIds = userSkills.map(skill => skill.id);
    return currentUserSkillIds.length !== selectedSkillIds.length || 
           !currentUserSkillIds.every(id => selectedSkillIds.includes(id));
  };

  const handleSubmit = async () => {
    if (selectedSkillIds.length === 0) {
      Alert.alert('Error', 'Please select at least one skill.');
      return;
    }
    
    try {
      await updateSkills({ skills: selectedSkillIds }).unwrap();
      Alert.alert(
        'Success',
        'Your skills have been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('Failed to update skills:', error);
      const errorMessage = error.data?.message || 'Failed to update skills. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleBackPress = () => {
    if (hasChanges()) {
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
  
  // Show loading state while fetching skills
  if (isLoadingSkills || isLoadingUserSkills) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading skills...</Text>
      </View>
    );
  }
  
  // Show error state if API call fails
  if (skillsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load skills. Please try again.</Text>
        <Button 
          mode="contained" 
          onPress={() => refetch()}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Select Your Skills" />
        {selectedSkillIds.length > 0 && (
          <Text style={styles.changesText}>{selectedSkillIds.length} selected</Text>
        )}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose the skills that match your expertise. You can update this anytime.
        </Text>
        
        <View style={styles.skillsContainer}>
          {allSkills.map(skill => {
            const isSelected = selectedSkillIds.includes(skill.id);
            return (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillItem,
                  isSelected && styles.skillItemSelected
                ]}
                onPress={() => handleToggleSkill(skill.id)}
                activeOpacity={0.7}
              >
                <View style={styles.skillContent}>
                  <View style={styles.skillTextContainer}>
                    <Text style={[
                      styles.skillLabel,
                      isSelected && styles.skillLabelSelected
                    ]}>
                      {skill.name}
                    </Text>
                    {skill.description && (
                      <Text style={styles.skillDescription}>
                        {skill.description}
                      </Text>
                    )}
                  </View>
                  <Checkbox.Android
                    status={isSelected ? 'checked' : 'unchecked'}
                    color={theme.colors.primary}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSkillIds.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected Skills ({selectedSkillIds.length}):</Text>
            <View style={styles.selectedSkillsList}>
              {selectedSkillIds.map(skillId => {
                const skill = allSkills.find(s => s.id === skillId);
                return skill ? (
                  <View key={skillId} style={styles.selectedSkillTag}>
                    <Text style={styles.selectedSkillText}>{skill.name}</Text>
                  </View>
                ) : null;
              })}
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
          disabled={selectedSkillIds.length === 0 || isUpdating}
          loading={isUpdating}
          contentStyle={styles.submitButtonContent}
        >
          {isUpdating ? 'Saving...' : 'Save Skills'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
  },
  skillTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default AddSkillsScreen;