import { useEffect, useState } from 'react'
import './admin.css'
import { signOut } from 'firebase/auth'
import { auth,db } from '../../firebaseConnection';
import { addDoc, collection, onSnapshot, query,orderBy,where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Admin(){

  const [InputTarefa,setInputTarefa]=useState('')
  const [user,setUser]=useState({})
  const [tarefas, setTarefas] = useState([]);
  const [edit, setEdit] = useState({})



  useEffect(()=>{
    async function loadTarefas(){
      const auxUser=localStorage.getItem("@detailUser")
      setUser(JSON.parse(auxUser))

      if(auxUser){
        const data = JSON.parse(auxUser);
        
        const tarefaRef = collection(db, "tarefas")
        const q = query(tarefaRef, orderBy("createdAt", "desc"), where("userId", "==", data?.uid))

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc)=> {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userId: doc.data().userId
            })
          })
          
          setTarefas(lista);


        })

      }

    }
    loadTarefas();
  },[])

  async function handleRegister(e){
    e.preventDefault();
    if(InputTarefa===""){
      alert("Digite sua tarefa...")
    }else{

      if(edit?.id){
        handleUpdateTarefa();
        return;
      }

        await addDoc(collection(db,"tarefas"),{
          tarefa:InputTarefa,
          createdAt:new Date(),
          userId:user?.uid
        }).then(()=>{
          alert("Tarefa registrada!!!!")
        }).catch(()=>{
          alert("Erro ao registrar tarefa!!!!")
        })
    }
  }

  async function handleUpdateTarefa(){
    const docRef = doc(db, "tarefas", edit?.id)
    await updateDoc(docRef, {
      tarefa: InputTarefa
    })
    .then(() => {
      console.log("TAREFA ATUALIZADA")
      setInputTarefa('')
      setEdit({})
    })
    .catch(() => {
      console.log("ERRO AO ATUALIZAR")
      setInputTarefa('')
      setEdit({})
    })
  }

  function editarTarefa(item){
    setInputTarefa(item.tarefa)
    setEdit(item);
  }


  async function deleteTarefa(id){
    const deletarDoc=doc(db,"tarefas",id)
    await deleteDoc(deletarDoc)
  }

  async function handleLogout(){
    await signOut(auth);
  }
  return(
    <div className='admin-container'>
      <h1>Minhas tarefas</h1>
      <form className='form' onSubmit={handleRegister}>
        <textarea 
          placeholder='Digite sua tarefa...'
          value={InputTarefa}
          onChange={(e)=>{setInputTarefa(e.target.value)}}
        />
          {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">Atualizar tarefa</button>
        ) : (
          <button className="btn-register" type="submit">Registrar tarefa</button>
        )}
      </form>
      {tarefas.map((item)=>(
      <article key={item.id} className="list">
        <p>{item.tarefa}</p>

        <div>
          <button onClick={()=>{editarTarefa(item)}}>Editar</button>
          <button className="btn-delete" onClick={()=>{deleteTarefa(item.id)}}>Concluir</button>
        </div>
      </article>
      ))}
      

      <button className="btn-logout" onClick={handleLogout}>Sair</button>

    </div>
  )
}