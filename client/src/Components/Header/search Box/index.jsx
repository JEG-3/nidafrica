  /* eslint-disable no-unused-vars */
import React from 'react';
import Button from '@mui/material/Button'
import { IoSearch } from 'react-icons/io5'

const SearchBox = () => {
  return (
    <div className="headerSearch ml-3 mr-3">
      <input type="text" autoComplete='true' requierd="requierd" placeholder='Search for a product...' />
      <Button><IoSearch /></Button>
    </div>
  );
}

export default SearchBox;