'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Content } from '@components/layout/Content';
import { Hero } from '@components/ui/Hero';
import { Title, Text, Box, Paper, Button, Badge, Loader } from '@mantine/core';

import { Demo3 } from '../../Demo';

const StatusPage = () => {
  const [mongoStatus, setMongoStatus] = useState<'online' | 'offline'>(
    'offline',
  );
  const [chromaStatus, setChromaStatus] = useState<'online' | 'offline'>(
    'offline',
  );
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const chroma = await axios.get('/api/status/chroma');
      setChromaStatus(chroma.data.status);
    } catch {
      setChromaStatus('offline');
    }

    try {
      const mongo = await axios.get('/api/status/mongo');
      setMongoStatus(mongo.data.status);
    } catch {
      setMongoStatus('offline');
    }

    setLoading(false);
  };

  const handleRestart = async (service: 'mongo' | 'chroma') => {
    await axios.post(`/api/status/restart`, { service });
    setTimeout(() => checkStatus(), 5000);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusBadge = (status: 'online' | 'offline') => (
    <Badge
      color={status === 'online' ? 'var(--mantine-color-red-9' : 'lime'}
      variant="filled"
    >
      {status.toUpperCase()}
    </Badge>
  );

  return (
    <>
      <Hero
        title="Welcome to Skillfully Human"
        description="Learn fast. Think deep. Stay real."
        imageSrc="/hero-home.png"
        height={300}
        position="center"
      />

      <Content>
        <Title order={2} mb="md">
          Database Status Dashboard
        </Title>

        <Paper p="md" withBorder shadow="xs">
          <Box
            mb="sm"
            display="flex"
            style={{ justifyContent: 'space-between' }}
          >
            <Text>ChromaDB (port 8000)</Text>
            {statusBadge(chromaStatus)}
            <Button onClick={() => handleRestart('chroma')} size="xs">
              Restart
            </Button>
          </Box>

          <Box
            mb="sm"
            display="flex"
            style={{ justifyContent: 'space-between' }}
          >
            <Text>MongoDB (port 27017)</Text>
            {statusBadge(mongoStatus)}
            <Button onClick={() => handleRestart('mongo')} size="xs">
              Restart
            </Button>
          </Box>

          {loading && (
            <Text size="sm" color="dimmed" mt="md">
              <Loader size="xs" mr="xs" /> Refreshing...
            </Text>
          )}
        </Paper>
      </Content>
    </>
  );
};

export default StatusPage;
