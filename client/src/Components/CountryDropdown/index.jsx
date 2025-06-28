/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import Button from '@mui/material/Button'
import Slide from '@mui/material/Slide'
import { FaAngleDown } from "react-icons/fa6"
import { Dialog } from '@mui/material';
import { IoSearch } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'
import { useState } from 'react'
import { MyContext } from '../../App';

const Transition = React.forwardRef( function Transition ( props, ref ) {
  return <Slide direction='up' ref={ ref } { ...props } />;
} )

const CountryDropdown = () => {
  const [ isOpenModal, setisOpenModal ] = useState( false );

  const [ selectedTab, setselectedTab ] = useState( null );

  const [ countryList, setcountryList ] = useState( [] );

  const context = useContext( MyContext );

  const selectCountry = ( index, country ) => {
    setselectedTab( index, country );
    setisOpenModal( false );
    context.setselectedCountry( country );
  }

  useEffect( () => {
    setcountryList( context.countryList );
  }, [] )

  const filterList = ( e ) => {
    const keyword = e.target.value.toLowerCase();

    if ( keyword !== "" ) {
      const list = countryList.filter( ( item ) => {
        return item.country.toLowerCase().includes( keyword );
      } );
      setcountryList( list );
    } else {
      setcountryList( context.countryList );
    }
  }

  return (
    <>
      <Button className='countryDrop' style={ {
        zoom: '120% !important',
        marginBottom: 'auto !important'
      } } onClick={ () => setisOpenModal( true ) }>
        <div className="info d-flex flex-column">
          <span className='label'>Your Location</span>
          <span className='name'>{ context.selectedCountry !== "" ? context.selectedCountry.length > 10 ? context.selectedCountry?.substr( 0, 10 ) + '...' : context.selectedCountry : 'Select A Location' }</span>
        </div>
        <span className='ml-auto r'><FaAngleDown /></span>
      </Button>


      <Dialog open={ isOpenModal } onClose={ () => setisOpenModal( false ) } className='locationModal' TransitionComponent={ Transition }>
        <h3 className='fr'>Chose your delivery location</h3>
        <p className='bi'>Enter your address and we will specify the offer for your area.</p>
        <Button className='close_' onClick={ () => setisOpenModal( false ) }><MdClose /></Button>

        <div className="headerSearch w-100">
          <input type="text" placeholder='Search your area...' onChange={ filterList } />
          <Button><IoSearch /></Button>
        </div>

        <ul className='countryList mt-3'>
          {
            countryList?.length !== 0 && countryList?.map( ( item, index ) => {
              return (
                <li key={ index }><Button onClick={ () => selectCountry( index, item.country ) }
                  className={ `${ selectedTab === index ? 'active' : '' }` }
                >{ item.country }</Button></li>
              )
            } )
          }
          <li><Button onClick={ () => setisOpenModal( false ) }></Button></li>
        </ul>
      </Dialog>

    </>
  );
}

export default CountryDropdown;