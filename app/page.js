"use client";

import { useState, useEffect } from 'react';
import { Box, Stack, Button, Typography, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { collection, query, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from './firebase'; // Ensure this path is correct based on your directory structure

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiquid, setIsLiquid] = useState(false);
  const [showNumberError, setShowNumberError] = useState(false);
  const [filter, setFilter] = useState('all'); // State for filter

  // Modal methods
  const [open, setOpen] = useState(false); // For item added confirmation modal

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const updatePantry = async () => {
      try {
        const snapshot = query(collection(firestore, 'pantry'));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        docs.forEach((doc) => {
          pantryList.push({ id: doc.id, ...doc.data() }); // Ensure doc.data() returns the full item
        });
        console.log("Pantry list:", pantryList); // Debug log
        setPantry(pantryList);
      } catch (error) {
        console.error("Error fetching pantry items:", error); // Debug log
      }
    };
    updatePantry();
  }, []);

  const addItem = async (item) => {
    // Check if the item is a number
    if (/^\d+$/.test(item)) {
      setShowNumberError(true); // Show error modal
      return;
    }
  
    if (item.trim() !== '') {
      try {
        const itemRef = doc(firestore, 'pantry', item);
        await setDoc(itemRef, {
          name: item,
          isLiquid: isLiquid,
          quantity: quantity,
        });
        setPantry((prevPantry) => [...prevPantry, { name: item, isLiquid, quantity, id: item }]);
        setInputValue(''); // Clear the input field after adding the item
        setQuantity(1); // Reset quantity
        setIsLiquid(false); // Reset liquid checkbox
        handleOpen(); // Show confirmation modal
      } catch (error) {
        console.error("Error adding item:", error);
      }
    } else {
      console.log('Item cannot be empty');
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'pantry', id));
      setPantry((prevPantry) => prevPantry.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Filter pantry items based on selected filter
  const filteredPantry = pantry.filter(item => {
    if (filter === 'all') return true;
    return filter === 'liquid' ? item.isLiquid : !item.isLiquid;
  });

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={2}
    >
      {/* Modal for item added confirmation */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #333',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Item Added!
          </Typography>
        </Box>
      </Modal>
  
      {/* Modal for number input error */}
      <Modal
        open={showNumberError}
        onClose={() => setShowNumberError(false)}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #333',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="error-modal-title" variant="h6" component="h2">
            Invalid Input
          </Typography>
          <Typography id="error-modal-description" sx={{ mt: 2 }}>
            Numbers are not allowed. Please enter valid text.
          </Typography>
        </Box>
      </Modal>

      {/* Header */}
      <Box
        width='800px'
        height='100px'
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

      {/* Filter Dropdown */}
      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="liquid">Liquids</MenuItem>
          <MenuItem value="non-liquid">Non-Liquids</MenuItem>
        </Select>
      </FormControl>
  
      {/* Input and Button */}
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          id="outlined-basic"
          label="Ingredient/Food"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <FormControl sx={{ minWidth: 80 }}>
          <InputLabel id="quantity-label">Quantity</InputLabel>
          <Select
            labelId="quantity-label"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            label="Quantity"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <MenuItem key={num} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLiquid}
              onChange={(e) => setIsLiquid(e.target.checked)}
            />
          }
          label="Liquid"
        />
        <Button
          variant="contained"
          onClick={() => addItem(inputValue)}
        >
          Add
        </Button>
      </Box>
  
      {/* Content */}
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'} mt={2}>
        {filteredPantry.length > 0 ? filteredPantry.map((item, index) => (
          <Box
            key={index}
            width="100%"
            minHeight="60px"
            display={'flex'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            p={2}
            borderRadius={2}
            sx={{ position: 'relative' }}
          >
            <Typography
              variant={'h6'}
              color={'#333'}
              fontWeight={300}
              sx={{ flexGrow: 1 }}
            >
              {item.name}
              {item.isLiquid && <span role="img" aria-label="water drop" style={{ color: '#00f', marginLeft: '8px' }}>💦</span>}
            </Typography>
            <Typography
              variant={'h6'}
              color={'#333'}
              fontWeight={300}
              sx={{ textAlign: 'center', flexGrow: 1 }}
            >
              {item.quantity}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeItem(item.id)}
              sx={{ position: 'absolute', right: '16px' }}
            >
              Remove
            </Button>
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
