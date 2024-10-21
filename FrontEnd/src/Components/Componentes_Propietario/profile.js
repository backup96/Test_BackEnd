import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userContext";
import { FaEdit, FaCheck } from "react-icons/fa";

const Profile = () => {
  const { user, loading: userLoading, error: userError, fetchUserData, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [personData, setPersonData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState({
    telefono: false,
    correo: false
  });
  const [formData, setFormData] = useState({
    telefono: "",
    correo: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (userLoading) return;

      if (!user) {
        setError("No hay un usuario autenticado");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching user data...");
        const data = await fetchUserData();
        console.log("User data received:", data);
        if (data) {
          setPersonData(data);
          setFormData({
            telefono: data.telefono || "",
            correo: data.correo || ""
          });
        } else {
          setError("No se pudo obtener los datos del usuario");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, userLoading, fetchUserData]);

  const handleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = (field) => {
    updateUserProfile(personData.numDocumento, { [field]: formData[field] })
      .then((result) => {
        if (result.success) {
          setAlertMessage(result.message);
          setShowAlert(true);
          setIsEditing(prev => ({
            ...prev,
            [field]: false
          }));
          setPersonData(prev => ({
            ...prev,
            [field]: formData[field]
          }));
        } else {
          throw new Error(result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMessage("Error al actualizar los datos");
        setShowAlert(true);
      });
  };
  

  if (userLoading || loading) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  if (userError || error) {
    return (
      <div className="text-center p-4 text-red-600">
        {userError || error}
        <button 
          onClick={() => navigate('/LoginPropietario')} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir al Login
        </button>
      </div>
    );
  }

  if (!user || !personData) {
    return (
      <div className="text-center p-4">
        No se encontraron datos del perfil
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Nombre Completo:</p>
            <p>{`${personData.nombre || ''} ${personData.apellido || ''}`}</p>
          </div>

          <div>
            <p className="font-medium">Número de Documento:</p>
            <p>{personData.numDocumento || 'No disponible'}</p>
          </div>

          <div>
            <p className="font-medium">Teléfono:</p>
            {isEditing.telefono ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => handleChange(e, 'telefono')}
                  className="border rounded p-1"
                />
                <FaCheck 
                  className="text-green-500 cursor-pointer" 
                  onClick={() => handleSave('telefono')}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{personData.telefono || 'No disponible'}</span>
                <FaEdit 
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => handleEdit('telefono')}
                />
              </div>
            )}
          </div>

          <div>
            <p className="font-medium">Correo:</p>
            {isEditing.correo ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleChange(e, 'correo')}
                  className="border rounded p-1"
                />
                <FaCheck 
                  className="text-green-500 cursor-pointer" 
                  onClick={() => handleSave('correo')}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{personData.correo || 'No disponible'}</span>
                <FaEdit 
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => handleEdit('correo')}
                />
              </div>
            )}
          </div>

          {personData.placaVehiculo && (
            <div>
              <p className="font-medium">Placa Vehículo:</p>
              <p>{personData.placaVehiculo}</p>
            </div>
          )}

          {personData.idParqueaderoFK && (
            <div>
              <p className="font-medium">Parqueadero:</p>
              <p>{personData.idParqueaderoFK}</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => fetchUserData()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Recargar Datos
      </button>

      {showAlert && (
        <div className={`fixed top-4 right-4 p-4 rounded ${
          alertMessage.includes("correctamente") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Profile;