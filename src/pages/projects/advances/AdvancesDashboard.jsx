
import ProjectNavbar from 'components/ProjectNavbar'

import React from 'react'
import New_advance_modal from 'components/New_advance_modal'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from 'context/userContext'
import { useQuery } from '@apollo/client'
import { GET_INSCRIPCION_ACEPTADA } from 'graphql/inscripciones/queries'
import TableAdvances from '../../../components/TableAdvances'
import { GET_PROJECT_STATE } from 'graphql/proyectos/queries'

const AdvancesDashboard = () => {
  const { userData } = useUser();
  const { _id } = useParams();
  const name_student = userData.nombre + " " + userData.apellido;
  const idEstudiante = userData._id + "";
  const idLider = userData._id + "";
  const [nombreProyecto, setNombreProyecto] = useState("");
  const idProyecto = _id;
  const [inscrito, setInscrito] = useState(false);
  
  const [isLider, setIsLider] = useState(false);
  const [numAdvances, setNumAdvances] = useState(0);
  const [activo, setActivo] = useState(false);
  const [finishedProject, setFinishedProject] = useState(false);
  
  const [openNewAdvanceModal, setNewAdvanceModal] = useState(false);
  
  const { data: dataEnroll, error: errorEnroll, loading: loadingEnroll } = useQuery(GET_INSCRIPCION_ACEPTADA, {
    variables: {
      idProyecto, idEstudiante
    },
  });

  const { data: infoProject, error: errorPr, loading: loadingProject } = useQuery(GET_PROJECT_STATE, {
    variables: {
      _id
    },
  });
  useEffect(() => {
    if (!loadingEnroll && dataEnroll) {
      console.log("dataEnroll",dataEnroll);
      if (dataEnroll.filtrarSiEstaInscrito) {
        
        if(dataEnroll.filtrarSiEstaInscrito.fechaEgreso==null){
          setInscrito(true);
        }
      } else {
        setInscrito(false);
        console.log(" inscripcion null");
      }

    }
  }, [dataEnroll]);

  useEffect(() => {
    if (!loadingProject && infoProject) {
      setNombreProyecto("Avances: " + infoProject.filtrarProyecto.nombre);
      console.log(" infoPr", infoProject);
      if (infoProject.filtrarProyecto.estado === "ACTIVO") {
        setActivo(true);
        
      } else { setActivo(false) };
      if (infoProject.filtrarProyecto.fase === "TERMINADO") {
        setFinishedProject(true);
        
      } else { setFinishedProject(false) };
  
      if (infoProject.filtrarProyecto.lider._id ===idLider ) {
        setIsLider(true);
        
      } else { setIsLider(false) };
    }


  }, [infoProject]);

  if (loadingProject || loadingEnroll) return <div>Cargando...</div>

  return (
    <div className="w-full h-full flex flex-col overflow-y-hidden  bg-gray-100" >

      <ProjectNavbar _idActual={_id} nombreProject={nombreProyecto} rutaRetorno={`/proyectos/proyecto/${_id}`} />
      {!finishedProject && <>
     
      {(inscrito || isLider) ?
        (<div>
          <TableAdvances idProject={_id}
            setModal={setNewAdvanceModal} setNumAdvances={setNumAdvances} activeProject={activo}
            finishedProject={finishedProject} openNewAdvanceModal={openNewAdvanceModal}>
          </TableAdvances></div>) : (<>
            <div className='w-full h-full  flex flex-col px-60  justify-center text-blue-600 '>
              <i className="fas fa-user-lock fa-4x" ></i>
              <span className='text-blue-600 text-2xl'>No puedes ver estos avances.</span>
              <span className='text-blue-800 text-2xl'>Aún no estás inscrito en este proyecto.</span>

            </div>
          </>)} </>}

          {finishedProject && <div>
            <div className='w-full h-full  flex flex-col px-60 py-20 justify-center text-blue-600 '>
              <i className="fas fa-user-lock fa-5x" ></i>
              <span className='text-blue-600 text-3xl mt-5'>No tienes acceso al proyecto.</span>
              <span className='text-blue-800 text-2xl mb-5 '>EL PROYECTO YA ESTÁ TERMINADO.     <i className="far fa-calendar-times fa-2x"></i></span>
          
            </div>
            </div>}

      {openNewAdvanceModal &&
        <New_advance_modal nameStudent={name_student} idStudent={idEstudiante}
          idProject={_id} numAdvancesP={numAdvances} setOpenModal={setNewAdvanceModal}></New_advance_modal>}

    </div>

  )

}



export default AdvancesDashboard
