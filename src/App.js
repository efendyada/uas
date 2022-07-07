//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {Table, Container, Row, Col,
  Button, ButtonGroup, Form, Nav, Navbar} from 'react-bootstrap';
import axios from 'axios';  
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

//const api = 'http://localhost:5000/users';

const initialState = {
  nama:"",
  alamat:"",
  email:"",
  telpon:""
};

function App() {
  const [state, setState]= useState(initialState);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {nama,alamat,email,telpon} = state;

  useEffect(() =>{
    loadUsers();
  },[])

  //function load user
  const loadUsers = async () =>{
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.get(
      `${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}`);
    setData(response.data);
  };

  //function input user  
  const handleChange = (e) =>{
    let {name, value} = e.target;
    setState({ ...state, [name]:value})
  };

  //function delete user
  const handleDelete = async (id) =>{
    if(window.confirm("Ciuss di Hapus?")){
      const devEnv = process.env.NODE_ENV !== "production";
       const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
      axios.delete(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`);
      toast.success("User berhasil dihapus");
      setTimeout(() =>loadUsers(), 400) ;
    }
  };

  //function update user
  const handleUpdate = (id) =>{
    const singleUser = data.find((item) => item.id == id);
    setState({...singleUser});
    setUserId(id);
    setEditMode(true);
  };

  //function submit user
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!nama || !alamat || !email || !telpon){
      toast.error("Mohon isi dengan lengkap")
    }else{
      if(!editMode){
        const devEnv = process.env.NODE_ENV !== "production";
        const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
        axios.post(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}`, state);
        toast.success("Input berhasil");
        setState({nama:"", alamat:"", email:"", telpon:""});
        setTimeout(() =>loadUsers(), 400);
      } else{
        const devEnv = process.env.NODE_ENV !== "production";
        const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
        axios.put(`${devEnv?REACT_APP_DEV_URL : REACT_APP_PROD_URL}
                /${userId}`, state);
        toast.success("Update berhasil");
        setState({nama:"", alamat:"", email:"", telpon:""});
        setTimeout(() =>loadUsers(), 400);
        setUserId(null);
        setEditMode(false);
      }

    }
  };
  return (
    <>
      <ToastContainer/>
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>
          CRUD Simple using React
        </Navbar.Brand>
      </Navbar>
      <Container style={{marginTop:"70px"}}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>Nama</Form.Label>
                <Form.Control type="text" placeholder='Masukan nama' name='nama' value={nama} onChange={handleChange}/>
              </Form.Group> 
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>Alamat</Form.Label>
                <Form.Control type="text" placeholder='Masukan alamat' name='alamat' value={alamat} onChange={handleChange}/>
              </Form.Group> 
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>Email</Form.Label>
                <Form.Control type="text" placeholder='Masukan email' name='email' value={email} onChange={handleChange}/>
              </Form.Group>
              <Form.Group>
               <Form.Label style={{textAlign:"left"}}>Telepon</Form.Label>
                <Form.Control type="text" placeholder='Masukan nomor telepon' name='telpon' value={telpon} onChange={handleChange}/>
              </Form.Group>  
              <div className='d-grid gap-2 mt-2'>
                <Button type='submit' variant='primary' size='1g'>
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Email</th>
                  <th>Telepon</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data && data.map((item, index)=>(
                <tbody key={index}>
                  <tr>
                    <td>{index+1}</td>
                    <td>{item.nama}</td>
                    <td>{item.alamat}</td>
                    <td>{item.email}</td>
                    <td>{item.telpon}</td>
                    <td>
                      <ButtonGroup>
                        <Button style={{marginRight:"5px"}} variant="secondary" onClick={() => handleUpdate(item.id)}>
                          Update
                        </Button>
                        <Button style={{marginRight:"5px"}} variant="danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
