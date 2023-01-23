import { useState } from 'react';
import './App.css';
import dropsymbol from './down.png'

function App() {

const schemas = [{"first_name":"First Name"}, {"last_name":"Last Name"}, {"gender":"Gender"}, {"age":"Age"}, {"account_name":"Account Name"}, {"city":"City"}, {"state":"State"}]
const [schema, setSchema] = useState({"add_schema_to_segment":"Add schema to segment"})
const [filteredschema, setFilteredschema] = useState(schemas)
const [addedschema, setAddedschema] = useState([])
const [segment, setSegment] = useState("")
const [toggle, setToggle] = useState(false);
const [savesegment,setSavesegment] = useState(true)


const Addschema = () =>{
  let filtereditems = filteredschema.filter((addschema)=> {return Object.values(schema)[0] !== Object.values(addschema)[0]})
  setFilteredschema(filtereditems)
  setAddedschema(()=>{
    if(Object.values(schema)[0] !== "Add schema to segment"){
      return [...addedschema, schema]
    }
    return [...addedschema]
  })
  setSchema({"add_schema_to_segment": "Add schema to segment"})

} 


function Deleteschema(deleteschema){
  let remainingschema = addedschema.filter((schema)=> Object.values(schema)[0] !== Object.values(deleteschema)[0])
  setAddedschema(remainingschema)
  setFilteredschema([...filteredschema, deleteschema])
}


function Changeschema(schema, changeschema){
  addedschema[addedschema.findIndex(item => Object.keys(item)[0] === Object.keys(changeschema)[0])] = schema
  filteredschema[filteredschema.findIndex(item => Object.keys(item)[0] === Object.keys(schema)[0])] = changeschema
  Addschema()
}


const Savesegments = async ()=> {
  await fetch('https://webhook.site/6dcfe45a-0423-4524-9638-ce4e32ab14eb', {
    method: 'POST',
    headers:{
      'content-Type':'application/json'
    },
    body:JSON.stringify({"segment_name":segment,
                         "schema":[...addedschema]
                        })}
  ).then(res => {alert("saved") 
  setAddedschema([]); 
  setFilteredschema(schemas);}
  ).catch(res => alert("Error"))
  
}


const handleClick = () => {
  setToggle(!toggle);
  setSavesegment(!savesegment)
};


const Cancel = ()=>{
  setToggle(false); 
  setAddedschema([]); 
  setFilteredschema(schemas); 
  setSegment(""); 
  setSavesegment(!savesegment)
}


const Save = (e)=>{
  e.preventDefault();
  if(addedschema.length !== 0){
    if(segment.length !== 0){
      Savesegments()
    }
    else{
      return alert("Enter the segment")
    }
    
  }
  else{
    return alert("Choose the schema")
  }
  
}

  return (
  <>
    
    {savesegment && <button className="save-seg" onClick={handleClick}>Save segment</button>}
    
    {toggle && 
      <div className="popup">
        <p className='popup-header'>Saving Segment</p>
        <p className='popup-text-1'>Enter the Name of the Segment</p>
        <input type="text" onChange={(e)=>setSegment(e.target.value)} placeholder='Name of the segment'/>
        <p className='popup-text-2'>To save your segment, you need to add the schemas to build the query</p>

        <div className="container">
          {addedschema.length !==0 && 
            <div className='schema-container'>
              {addedschema.map((addedschema)=> {return(
                <div className='schema-width' key={Object.keys(addedschema)}>
                  <div className='dropdownschema'>
                    <div className="dropdown">
                      
                      <button className="dropbtn">{Object.values(addedschema)} <img className='dropsymbol' src={dropsymbol} alt='img'/></button>
                    
                      <div className="dropdown-content">
                        {filteredschema.map((schema)=>{
                          return <p className='p-schema' onClick={()=> Changeschema(schema, addedschema)} key={Object.keys(schema)}>{Object.values(schema)}</p>
                        })}
                      </div>
                    </div>
                    <button className="deletebtn" onClick={()=>Deleteschema(addedschema)}>-</button>
                  </div>
                  <br></br><br></br>
                </div>
              )})}
            </div>
          }

          <br></br><br></br>

          <div className="dropdownschema">
            <div className="dropdown">
              <button className="dropbtn">{Object.values(schema)} <img className='dropsymbol' src={dropsymbol} alt='img'/></button>
              <div className="dropdown-content-2">
                {filteredschema.map((schema)=>{
                  return <p onClick={()=> setSchema(schema)} key={Object.keys(schema)}>{Object.values(schema)}</p>
                })}
              </div>
            </div>
            <button className='deletebtn' onClick={()=>{setSchema({"add_schema_to_segment": "Add schema to segment"})}}>-</button>
          </div>
          
          <br></br><br></br>

          <p className="add-schema" onClick={Addschema} ><u>+ Add new schema</u></p><br></br><br></br>
          <div className="save-cancel-button">
          <button className="savebtn" type="submit" onClick={Save}>save segment</button>
          <button className="cancelbtn" onClick={Cancel}>Cancel</button>
          </div>
          
        </div>

      </div>

    }
    
  </>  
  );
  
}

export default App;
