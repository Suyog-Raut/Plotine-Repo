import NavBar from '../components/navbar'
import Table from '../components/table'
import Editor from '../components/Editor'
export default function Home() {
  return (
    <div className='d-flex'>
  <NavBar />
  <Editor />
  <Table />
  </div>
  )
}
