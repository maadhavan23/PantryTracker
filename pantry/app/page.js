"use client";

import { useState, useEffect } from 'react';
import { Box, Stack, Typography } from "@mui/material";
import { collection, query, getDocs } from "firebase/firestore";
import { firestore } from './firebase'; // Ensure this path is correct based on your directory structure

export default function Home() {
  const [pantry, setPantry] = useState([]);

  useEffect(() => {
    const updatePantry = async () => {
      try {
        const snapshot = query(collection(firestore, 'pantry'));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        docs.forEach((doc) => {
          pantryList.push(doc.id);
        });
        console.log("Pantry list:", pantryList); // Debug log
        setPantry(pantryList);
      } catch (error) {
        console.error("Error fetching pantry items:", error); // Debug log
      }
    };
    updatePantry();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {/* Header */}
      <Box
        width='800px'
        height='100px'
        <Button variant="contained">Contained</Button>
        bgcolor={'#ADD8E6'}
        border={'2px solid #333'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography
          variant={'h2'}
          color={'#333'}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          Pantry Items
        </Typography>
      </Box>

      {/* Content */}
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'} mt={2}>
        {pantry.length > 0 ? pantry.map((item, index) => (
          <Box
            key={index}
            width="100%"
            minHeight="300px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
          >
            <Typography
              variant={'h4'}
              color={'#333'}
              textAlign={'center'}
              fontWeight={300}
            >
              {item}
            </Typography>
          </Box>
        )) : (
          <Typography
            variant={'h6'}
            color={'#333'}
            textAlign={'center'}
          >
            No items in the pantry.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
