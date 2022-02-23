import Image from "next/image"
import User1 from '../public/julian-wan-WNoLnJo7tS8-unsplash 1.png'
import User2 from '../public/julian-wan-WNoLnJo7tS8-unsplash 2.png'
import User3 from '../public/julian-wan-WNoLnJo7tS8-unsplash 3.png'


export default function Table(props) {

  return (
    <div className="section2">
    <div className="box1">
      <h3>Box 1</h3>
     <div className="userdiv">
       <div className="flex">
         <Image src={User1}/>
         <h4>Speaker 1</h4>
         <p>09:30</p>
       </div>
       <div className="data">
         <p> There are many variations of Lorem Ipsum but the majority have suffered alteration There are many variationpassages of Lorem Ipsum available, but the majority have salteration in some form, by injected humour, or randowowhich don't look even slightly believable. If you are going to use a passage.</p>
       </div>
     </div>
    
    <div className="userdiv">
       <div className="flex">
         <Image src={User2}/>
         <h4>Speaker 2</h4>
         <p>09:30</p>
       </div>
       <div className="data">
         <p> There are many variations of Lorem Ipsum but the majority have suffered alteration There are many variationpassages of Lorem Ipsum available, but the majority have salteration in some form, by injected humour, or randowowhich don't look even slightly believable. If you are going to use a passage.</p>
       </div>
     </div>
  
     <div className="userdiv">
     <div className="flex">
       <Image src={User3}/>
       <h4>Speaker 3</h4>
       <p>09:30</p>
     </div>
     <div className="data">
       <p> There are many variations of Lorem Ipsum but the majority have suffered alteration There are many variationpassages of Lorem Ipsum available, but the majority have salteration in some form, by injected humour, or randowowhich don't look even slightly believable. If you are going to use a passage.</p>
     </div>
   </div>
  </div>
    <div className="box2">
     

     </div>
    </div>

  )
}


