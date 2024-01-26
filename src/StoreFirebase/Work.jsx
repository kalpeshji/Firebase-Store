import React, { useEffect, useState } from 'react' 
import { db } from './firebase' 
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore' 
import { Col, Row, Table } from 'react-bootstrap' 
import './main.css' 
export default function Work() {
    const [input, setInput] = useState({ name: '', email: '', address: '' }) 
    const [users, setUsers] = useState([]) 
    const [error, setError] = useState({}) 
    const [id, setId] = useState('') 
    const [edit, setEdit] = useState(false) 
    const [noRecords, setNoRecords] = useState(false) 

    useEffect(() => {
        fetchUsers() 
    }, []) 

    useEffect(() => {
        setNoRecords(users.length === 0) 
    }, [users]) 

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users')) 
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
            setUsers(list) 
        } catch (error) {
            console.error("Error fetching users: ", error) 
        }
    } 

    const handleSubmit = async (e) => {
        e.preventDefault() 
        const newError = validateInput() 
        if (Object.keys(newError).length === 0) {
            if (edit) {
                try {
                    const userRef = doc(db, `users/${id}`) 
                    await updateDoc(userRef, input) 
                    setEdit(false) 
                    setId('') 
                } catch (error) {
                    console.error("Error updating user: ", error) 
                }
            } else {
                try {
                    await addDoc(collection(db, 'users'), input) 
                } catch (error) {
                    console.error("Error adding user: ", error) 
                }
            }
            fetchUsers() 
            setInput({ name: '', email: '', address: '' }) 
        } else {
            setError(newError) 
        }
    } 

    const validateInput = () => {
        const errors = {} 
        if (!input.name) errors.name = 'Name is required!' 
        if (!input.email) errors.email = 'Email is required!' 
        if (!input.address) errors.address = 'Address is required!' 
        return errors 
    } 

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value }) 
        setError({ ...error, [e.target.name]: '' }) 
    } 

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, `users/${id}`)) 
            fetchUsers() 
        } catch (error) {
            console.error("Error deleting user: ", error) 
        }
    } 

    const handleEdit = async (id) => {
        try {
            const userRef = doc(db, `users/${id}`) 
            const data = await getDoc(userRef) 
            if (data.exists()) {
                setInput(data.data()) 
                setId(id) 
                setEdit(true) 
            } else {
                alert("Document not found.") 
            }
        } catch (error) {
            console.error("Error fetching user: ", error) 
        }
    } 

    return (
        <>
            <main className='dark-bg vh-100'>
                <Row className='g-0'>
                    <Col lg={4}>
                        <div className="forms m-3">
                            <h5 className='text-light fs-4 mb-4'>{edit ? 'Update' : "Add"} User</h5>
                            <form onSubmit={handleSubmit}>
                                <input type='text' name='name' className='form-control mb-4' value={input.name} placeholder='Enter Name' onChange={handleChange} />
                                <p className='error'>{error.name}</p>
                                <input type='email' name='email' className='form-control mb-4' value={input.email} placeholder='Enter Email' onChange={handleChange} />
                                <p className='error'>{error.email}</p>
                                <textarea name='address' className='form-control hei' value={input.address} placeholder='Enter Address' onChange={handleChange} />
                                <p className='error mt-3'>{error.address}</p>
                                <button className='btn btn-outline-light mt-4 px-4'>{edit ? 'UPDATE' : "ADD"}</button>
                            </form>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div className="tables m-3 ms-0">
                            <h5 className='text-light fs-4 mb-4'>User List</h5>
                            <div className="ove">
                                <Table className='table rounded-5' responsive striped bordered hover variant="light">
                                    <thead>
                                        <tr>
                                            <th className='text-center'>S.R. No.</th>
                                            <th className='text-center'>Name</th>
                                            <th className='text-center'>Email</th>
                                            <th className='text-center'>Address</th>
                                            <th className='text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {noRecords ? (
                                            <tr>
                                                <td className='text-center text-dark-emphasis fw-bolder fs-4 py-5' colSpan={5}>No Records Found</td>
                                            </tr>
                                        ) : (
                                            users.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.address}</td>
                                                    <td className='text-center d-flex justify-content-center'>
                                                        <button className='btn btn-outline-secondary me-1' onClick={() => handleDelete(item.id)}><i className="bi bi-trash-fill"></i></button>
                                                        <button className='btn btn-outline-secondary ms-1' onClick={() => handleEdit(item.id)}><i className="bi bi-pencil-fill"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </main>
        </>
    ) 
}

