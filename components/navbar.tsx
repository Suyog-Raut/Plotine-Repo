import Table from './table.js';
import Image from 'next/image';
import Logo from '../public/logo-02 1.jpg'
import Settings from '../public/Cog.jpg'

export default function NavBar() {
  return (
  <div className='header'>
    <div className='logo'>
<Image src={Logo} alt="logo"/>
</div>
<div className='vertical' />

<p>Data</p>
<div className='set'>
<Image src={Settings} alt="logo"/></div>
    </div>
  )
}
