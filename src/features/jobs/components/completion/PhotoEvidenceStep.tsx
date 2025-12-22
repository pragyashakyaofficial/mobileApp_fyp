import React, { useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import { Button, Text } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import styled from 'styled-components/native';

const PhotoEvidenceStep = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImages([...images, image.path]);
    });
  };

  return (
    <Container>
      <Text>Please provide at least 3 photos of the completed work.</Text>
      <Button mode="contained" onPress={handleTakePhoto} style={{ marginTop: 16 }}>
        Take Photo
      </Button>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => <StyledImage source={{ uri: item }} />}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  margin: 8px;
`;

export default PhotoEvidenceStep;
