import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function FieldDataScreen() {
  const [projectId, setProjectId] = useState('1');
  const [lat, setLat] = useState('19.076');
  const [lon, setLon] = useState('72.8777');
  const [value, setValue] = useState('12.5');

  const submit = async () => {
    const payload = {
      observedAt: new Date().toISOString(),
      location: { lat: Number(lat), lon: Number(lon) },
      measurements: [ { type: 'biomass', unit: 't/ha', value: Number(value) } ]
    };
    const resp = await fetch(`http://localhost:3000/projects/${projectId}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await resp.json();
    alert(JSON.stringify(json));
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Project ID</Text>
      <TextInput value={projectId} onChangeText={setProjectId} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>Latitude</Text>
      <TextInput value={lat} onChangeText={setLat} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>Longitude</Text>
      <TextInput value={lon} onChangeText={setLon} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Text>Biomass (t/ha)</Text>
      <TextInput value={value} onChangeText={setValue} style={{ borderWidth: 1, marginBottom: 8 }} />
      <Button title="Submit" onPress={submit} />
    </View>
  );
}


