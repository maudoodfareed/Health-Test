import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';




// Sample data provided in the prompt
const sampleData = [
  { id: '001', date: '2023-07-01', a1c: 5.6, ldl: 120, glucose: 98 },
  { id: '002', date: '2023-06-15', a1c: 6.1, ldl: 145, glucose: 110 },
  { id: '003', date: '2023-05-10', a1c: 6.7, ldl: 160, glucose: 126 },
];

// Risk thresholds
const thresholds = {
  a1c: 6.5,
  ldl: 160,
  glucose: 126,
};

// Function to check if a value is at high risk
const isHighRisk = (metric, value) => {
  return value >= thresholds[metric];
};

const BloodMetricsDashboard = () => {
  const [summary, setSummary] = useState(''); // State to store the GPT summary
  const [loading, setLoading] = useState(false); // State to handle loading indicator

  // Function to call OpenAI API and get the summary
  const getSummary = async () => {
    setLoading(true); // Start loading
    setSummary(''); // Clear previous summary

    // Prepare the data to be sent to GPT
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Analyze the following blood metrics data give your insights for each patient according to the Risk thresholds provided. Identify the patient with the highest risk.
        
        Data:
        ${JSON.stringify(sampleData)}

        Risk thresholds:
        A1C >= 6.5%, LDL >= 160 mg/dL, Glucose >= 126 mg/dL.

        Just give your overview of how the health of each record looks like and highest risk patient, no need to give any extra text or information`
      }
    ];
    
    
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: messages,
          max_tokens: 1500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      // Set the summary received from GPT
      setSummary(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error fetching data from OpenAI API:', error);
      setSummary('Failed to fetch summary. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <h1>Blood Metrics Dashboard</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>A1C</TableCell>
              <TableCell>LDL</TableCell>
              <TableCell>Glucose</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell
                  style={{ color: isHighRisk('a1c', record.a1c) ? 'red' : 'inherit' }}
                >
                  {record.a1c}
                </TableCell>
                <TableCell
                  style={{ color: isHighRisk('ldl', record.ldl) ? 'red' : 'inherit' }}
                >
                  {record.ldl}
                </TableCell>
                <TableCell
                  style={{ color: isHighRisk('glucose', record.glucose) ? 'red' : 'inherit' }}
                >
                  {record.glucose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Button to summarize risk */}
      <Button
        variant="contained"
        color="error"
        onClick={getSummary}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        Risk Analysis
      </Button>

      {/* Loading indicator */}
      {loading && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={24} style={{ marginRight: '10px' }} />
          <Typography variant="body1">Analyzing data, please wait...</Typography>
        </div>
      )}

      {/* Display the summary from GPT */}
      {summary && !loading && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Risk Summary From GPT:
        </Typography>
      )}
      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
        {summary}
      </Typography>
    </Container>
  );
};

export default BloodMetricsDashboard;
