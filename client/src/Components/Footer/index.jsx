/* eslint-disable no-unused-vars */
import React from 'react';
import { LuShirt } from 'react-icons/lu'
import { TbTruckDelivery } from 'react-icons/tb'
import { TbDiscount } from 'react-icons/tb'
import { CiBadgeDollar } from 'react-icons/ci'
import { Link } from 'react-router-dom';
import { FaFacebookF } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="topInfo row">
          <div className="col d-flex align-items-center">
            <span><LuShirt /></span>
            <span className='ml-2'>Fresh Products Daily</span>
          </div>
          <div className="col d-flex align-items-center">
            <span><TbTruckDelivery /></span>
            <span className='ml-2'>Free Delivery For Order Over 90$</span>
          </div>
          <div className="col d-flex align-items-center">
            <span><TbDiscount /></span>
            <span className='ml-2'>Daily Mega Discounts</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>< CiBadgeDollar /></span>
            <span className='ml-2'>Best Price On The Market</span>
          </div>
        </div>


        <div className="row mt-5 linksWrap">
          <div className="col">
            <h5>FRUITS & VEGETABLES</h5>
            <ul>
              <li> <Link to="/cat/1">Fresh Vegetables</Link></li>
              <li><Link to="/cat/1">Herbs & Seasonings</Link></li>
              <li><Link to="/cat/1">Fresh Fruits</Link></li>
              <li><Link to="/cat/1">Exotic Fruits & Veggies</Link></li>
              <li> <Link to="/cat/1">Cuts & Sprouts</Link></li>
              <li><Link to="/cat/1">Packaged Produce</Link></li>
              <li><Link to="/cat/1">Party Trays</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>HERBAL BASED  </h5>
            <ul>
              <li> <Link to="/cat/1">Fresh Vegetables</Link></li>
              <li><Link to="/cat/1">Herbs & Seasonings</Link></li>
              <li><Link to="/cat/1">Fresh Fruits</Link></li>
              <li><Link to="/cat/1">Exotic Fruits & Veggies</Link></li>
              <li> <Link to="/cat/1">Cuts & Sprouts</Link></li>
              <li><Link to="/cat/1">Packaged Produce</Link></li>
              <li><Link to="/cat/1">Party Trays</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>HERBAL TABLETS</h5>
            <ul>
              <li> <Link to="/cat/1">Fresh Vegetables</Link></li>
              <li><Link to="/cat/1">Herbs & Seasonings</Link></li>
              <li><Link to="/cat/1">Fresh Fruits</Link></li>
              <li><Link to="/cat/1">Exotic Fruits & Veggies</Link></li>
              <li> <Link to="/cat/1">Cuts & Sprouts</Link></li>
              <li><Link to="/cat/1">Packaged Produce</Link></li>
              <li><Link to="/cat/1">Party Trays</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>FRUIT MADE CAPSULES</h5>
            <ul>
              <li> <Link to="/cat/1">Fresh Vegetables</Link></li>
              <li><Link to="/cat/1">Herbs & Seasonings</Link></li>
              <li><Link to="/cat/1">Fresh Fruits</Link></li>
              <li><Link to="/cat/1">Exotic Fruits & Veggies</Link></li>
              <li> <Link to="/cat/1">Cuts & Sprouts</Link></li>
              <li><Link to="/cat/1">Packaged Produce</Link></li>
              <li><Link to="/cat/1">Party Trays</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>WITH SIDE EFFECTS</h5>
            <ul>
              <li> <Link to="/cat/1">Fresh Vegetables TABLETS</Link></li>
              <li><Link to="/cat/1">Herbs & Seasonings Capsules</Link></li>
              <li><Link to="/cat/1">Fresh Fruit Capsules</Link></li>
              <li><Link to="/cat/1">Exotic Fruits & Veggies Capsules</Link></li>
              <li> <Link to="/cat/1">Cuts & Sprouts</Link></li>
              <li><Link to="/cat/1">Packaged Produce</Link></li>
              <li><Link to="/cat/1">Party Trays</Link></li>
            </ul>
          </div>
        </div>


        <div className="copyright mt-3 pt-3 pb-3 d-flex">
          <p className='ft mb-0' >Copyright 2024 . All rights reserved . Powered by Naturetwig</p>
          <ul className="list list-inline ml-auto mb-0 socials">
            <li className="list-inline-item">
              <Link to="/cat/1"><FaFacebookF/></Link>
            </li>
            <li className="list-inline-item">
              <Link to="/cat/1"><FaTwitter/></Link>
            </li>
            <li className="list-inline-item">
              <Link to="/cat/1"><FaInstagram/></Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
