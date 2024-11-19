import axios from 'axios'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import * as yup from 'yup'

function Todolist2() {
 
    let [table,setTable]=useState([])
    let [employeename,setEmployeeName]=useState('')
    let [mobile,setMobile]=useState('')
    let [employeeId,setEmployeeId]=useState('')
    let [edit,setEdit]=useState(false)
     let[button,setbutton]=useState('Save') //caps S for Save // i call button instead of save and update button

    let schema = yup.object().shape({
        employeename: yup.string().trim().required('name is required'),
       mobile: yup.string().trim().matches(/\d/, "Enter only digits").required('Phone number is required')
       
      })

    useEffect(()=>{
       fetchdata() 

   },[])

let fetchdata=async()=>{
    let response=await axios.get('http://catodotest.elevadosoftwares.com/Employee/GetAllEmployeeDetails')
    console.log(response.data);
    setTable(response.data.employeeList)
    }
   
    let style={
        headRow:{style:{backgroundColor:'black'}},
        headCells:{style:{color:'white',fontSize:'14px'}}
    }
      
    let columns=[
        {
            name:'employeeId',
            selector:row=>row.employeeId,
            sortable:true
        },
        {
            name:'employeeName',
            selector:row=>row.employeeName,
            sortable:true
        },
        {
          name:'mobile',
          selector:row=>row.mobile,
          sortable:true
        },
        {
          name:'Action',
          cell: row=>(
            <div>
              <button onClick={()=>handleEdit(row.employeeId)}>Edit</button>
              <button onClick={()=>handledelete(row.employeeId)}>delete</button>
            </div>
          )
        }
    ]

     let handledelete=(id)=>{
           axios.post('http://catodotest.elevadosoftwares.com/Employee/RemoveEmployee',{employeeId:id}).then(res=>{
            console.log(res.data);
           alert('data delete')
           fetchdata()
           })
     }

        let handleEdit=(id)=>{
          console.log(id);
          let filterdata=table.filter(item=>item.employeeId==id)
          console.log(filterdata);
          filterdata.map(item=>(
            setEmployeeName(item.employeeName),
            setEmployeeId(item.employeeId),
            setMobile(item.mobile)
          ))
      setEdit(true)
      setbutton('Update')
        } 

      let handleSubmit=(e)=>{
        e.preventDefault()
        console.log( employeename,mobile);
        if(edit){
          handleupdate()
        }
        else{
         handlesave()
        }
      }

   let handlesave=()=>{
        let data={
            employeename:employeename,
            mobile:mobile
        }
        axios.post('http://catodotest.elevadosoftwares.com/Employee/InsertEmployee',data).then(res=>{
            console.log(res.data)
            alert('data saved')
            fetchdata()

        })
    }

    let handleupdate=()=>{
      let data={
        employeeId:employeeId,
          employeename:employeename,
          mobile:mobile

      }
      axios.post('http://catodotest.elevadosoftwares.com/Employee/InsertEmployee',data).then(res=>{
          console.log(res.data)
          alert('data updated')
          setEmployeeName("")
          setMobile('')
          fetchdata()

      })
      setbutton('Save')
      setEdit(false)
  }

      let handleCancel=()=>{
    setEmployeeName('')
    setMobile('')
         
    }
  return (
    <div><h1>Todolist2</h1>
    
        <Formik 
        initialValues={{employeename,mobile}}
        onSubmit={handleSubmit}
        validationSchema={schema}
        >

    <Form onSubmit={handleSubmit}> 
 <Form.Control type="text" placeholder="name" value={employeename} onChange={(e) => setEmployeeName(e.target.value)} />

 <Form.Control type="text"placeholder="mobile no" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
     
    < button type='submit'>{button} </button>
    <button type='button' onClick={handleCancel}> cancel</button>  
    
      </Form>
        </Formik>
        
      
           
      <DataTable
       data={table}
       columns={columns}
       customStyles={style}
       pagination
       paginationPerPage={5}
       paginationRowsPerPageOptions={[5, 10, 15, 20]}
       selectableRows
       selectableRowsHighlight
       highlightOnHover
      />

        </div>
  )
}

export default Todolist2