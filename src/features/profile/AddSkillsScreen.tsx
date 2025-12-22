import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Checkbox, List, Text, useTheme } from 'react-native-paper';
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
    // For now, we just navigate back. Later, this will be passed back to the profile screen.
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Select Your Skills</Text>
        {availableSkills.map(skill => (
          <List.Item
            key={skill}
            title={skill}
            onPress={() => handleToggleSkill(skill)}
            right={() => <Checkbox status={selectedSkills.includes(skill) ? 'checked' : 'unchecked'} />}
          />
        ))}
      </ScrollView>
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Add Skills
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default AddSkillsScreen;
