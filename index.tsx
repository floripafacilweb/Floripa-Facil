
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X, 
  Phone, 
  Star, 
  ShieldCheck, 
  Heart,
  CreditCard,
  ChevronLeft,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut
} from 'lucide-react';

// --- INITIAL DATA (Simulating DB) ---

const INITIAL_DESTINATIONS = [
  {
    id: 'floripa',
    name: 'Florianópolis',
    shortDesc: 'La Isla de la Magia',
    description: 'La capital de Santa Catarina, famosa por sus 42 playas, mariscos frescos y vida nocturna. Ideal para familias y surfistas.',
    travelerType: 'Familias, Parejas y Aventureros',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop',
    attractions: ['Playa Joaquina', 'Barra da Lagoa', 'Centro Histórico', 'Ilha do Campeche'],
    gallery: [
      'https://images.unsplash.com/photo-1596395819057-d375222c7f5a?q=80&w=800',
      'https://images.unsplash.com/photo-1626456729562-b25859591448?q=80&w=800',
    ]
  },
  {
    id: 'bombinhas',
    name: 'Bombinhas',
    shortDesc: 'El caribe brasileño',
    description: 'Un paraíso ecológico con aguas cristalinas, ideal para buceo y relax total. Destino tranquilo y seguro.',
    travelerType: 'Relax, Amantes de la naturaleza',
    image: 'https://images.unsplash.com/photo-1592257008323-2895f32b7246?q=80&w=2070&auto=format&fit=crop',
    attractions: ['4 Ilhas', 'Playa Sepultura', 'Mariscal', 'Mirador Eco 360'],
    gallery: [
      'https://images.unsplash.com/photo-1552250550-9602bc629325?q=80&w=800',
      'https://images.unsplash.com/photo-1544979140-58d39f2eb50e?q=80&w=800'
    ]
  },
  {
    id: 'camboriu',
    name: 'Balneário Camboriú',
    shortDesc: 'La Dubai brasileña',
    description: 'Rascacielos frente al mar, teleféricos y mucha diversión nocturna. La mezcla perfecta entre ciudad y playa.',
    travelerType: 'Jóvenes, Grupos, Familias activas',
    image: 'https://images.unsplash.com/photo-1565034873752-9694eb1019a3?q=80&w=1974&auto=format&fit=crop',
    attractions: ['Parque Unipraias', 'Barco Pirata', 'Rueda Gigante', 'Playa Central'],
    gallery: [
      'https://images.unsplash.com/photo-1588691517446-c74377b55f52?q=80&w=800',
      'https://images.unsplash.com/photo-1518659426914-99607144e59c?q=80&w=800'
    ]
  }
];

const INITIAL_PACKAGES = [
  {
    id: 'bombinhas-relax',
    title: 'Bombinhas Relax',
    subtitle: 'El más vendido',
    destinations: ['Florianópolis', 'Bombinhas'], // Should link to destinationId in real DB
    destinationId: 'bombinhas',
    price: 220,
    isBestSeller: true,
    features: [
      'Traslado Florianópolis ↔ Bombinhas',
      'Excursión playas de Bombinhas + 4 Ilhas',
      'Asistencia en español 24/7',
      'Coordinador en destino'
    ],
    image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2064&auto=format&fit=crop'
  },
  {
    id: 'camboriu-esencial',
    title: 'Camboriú Esencial',
    subtitle: 'Diversión asegurada',
    destinations: ['Florianópolis', 'Camboriú'],
    destinationId: 'camboriu',
    price: 210,
    isBestSeller: false,
    features: [
      'Traslado Florianópolis ↔ Camboriú',
      'City Tour Panorámico',
      'Entrada a Parque Unipraias (Opcional)',
      'Asistencia en español'
    ],
    image: 'https://images.unsplash.com/photo-1555992984-25785a720db1?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 'combo-2-destinos-premium',
    title: 'Bombinhas + Camboriú Premium',
    subtitle: 'Lo mejor de dos mundos',
    destinations: ['Bombinhas', 'Camboriú'],
    destinationId: 'combo', // Logic handle
    price: 450,
    isBestSeller: false,
    features: [
      'Traslados entre destinos',
      '3 Noches en Bombinhas',
      '3 Noches en Camboriú',
      'Excursión Barco Pirata'
    ],
    image: 'https://images.unsplash.com/photo-1518182170546-0766bd6f6a56?q=80&w=2061&auto=format&fit=crop'
  }
];

const COLORS = {
  primary: '#1E88E5', // Blue Brasil
  secondary: '#2ECC71', // Green Tropical
  highlight: '#F4D03F', // Yellow Sand
  text: '#333333', // Dark Grey
  white: '#FFFFFF',
  lightGrey: '#F3F4F6',
  danger: '#EF4444'
};

const CONTACT = {
  whatsapp: '5491112345678', 
  email: 'reservas@floripafacil.com'
};

// --- COMPONENTS ---

const Navbar = ({ setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView({ name: 'HOME' })}>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold" style={{ color: COLORS.primary }}>FLORIPA FÁCIL</span>
              <span className="text-xs font-medium text-gray-500 tracking-wider">VIAJÁ TRANQUILO</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setView({ name: 'HOME' })} className="text-gray-600 hover:text-[#1E88E5] font-medium transition">Inicio</button>
            <button onClick={() => window.location.href='#destinations'} className="text-gray-600 hover:text-[#1E88E5] font-medium transition">Destinos</button>
            <button onClick={() => window.location.href='#packages'} className="text-gray-600 hover:text-[#1E88E5] font-medium transition">Paquetes</button>
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp}`, '_blank')}
              className="px-6 py-2 rounded-full text-white font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.primary }}
            >
              Contactar
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { setView({ name: 'HOME' }); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Inicio</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ setView }) => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.primary }}>FLORIPA FÁCIL</h3>
          <p className="text-gray-400 mb-4">"Viajá tranquilo, nosotros nos ocupamos."</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Empresa</h4>
          <ul className="space-y-2 text-gray-400">
             <li className="cursor-pointer hover:text-white" onClick={() => setView({ name: 'HOME' })}>Inicio</li>
             <li className="cursor-pointer hover:text-white" onClick={() => setView({ name: 'ADMIN_LOGIN' })}>Admin Access</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contacto</h4>
          <div className="space-y-3">
            <button 
              onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp}`, '_blank')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
            >
              <Phone size={18} />
              <span>WhatsApp: +54 9 11 1234-5678</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- VIEWS ---

const HomeView = ({ setView, destinations, packages }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544979140-58d39f2eb50e?q=80&w=2070&auto=format&fit=crop" 
            alt="Playas de Brasil" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
            Traslados y Paquetes en <span style={{ color: COLORS.highlight }}>Brasil</span>
          </h1>
          <button 
            onClick={() => { document.getElementById('packages').scrollIntoView({ behavior: 'smooth' }) }}
            className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
            style={{ backgroundColor: COLORS.primary }}
          >
            Reservar Ahora
          </button>
        </div>
      </div>

      <div className="bg-white py-12 border-b border-gray-100 shadow-sm relative z-20 -mt-8 rounded-t-3xl mx-4 lg:mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="flex flex-col items-center text-center">
            <Users size={32} style={{ color: COLORS.primary }} className="mb-4" />
            <h3 className="font-bold text-lg mb-2">Atención en Español</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={32} style={{ color: COLORS.secondary }} className="mb-4" />
            <h3 className="font-bold text-lg mb-2">Proveedores Verificados</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <Heart size={32} className="text-yellow-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Viaje sin Estrés</h3>
          </div>
        </div>
      </div>

      <section id="destinations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Destinos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div 
                key={dest.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col h-full"
                onClick={() => setView({ name: 'DESTINATION', params: dest })}
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <p className="text-gray-600 mb-4">{dest.description.substring(0, 100)}...</p>
                  <button className="text-blue-600 font-semibold hover:underline">Ver detalles</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Paquetes Destacados</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                {pkg.isBestSeller && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10" style={{ backgroundColor: COLORS.highlight, color: COLORS.text }}>
                    Más Vendido
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{pkg.title}</h3>
                  <div className="mt-auto border-t pt-4">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-gray-500 text-sm">Precio por persona</span>
                      <span className="text-3xl font-bold" style={{ color: COLORS.primary }}>${pkg.price} <span className="text-sm font-normal text-gray-400">USD</span></span>
                    </div>
                    <button 
                      onClick={() => setView({ name: 'BOOKING', params: pkg })}
                      className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90 shadow-md flex justify-center items-center"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Reservar Ahora <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const DestinationView = ({ dest, setView, packages }) => {
  const relatedPackage = packages.find(p => p.destinationId === dest.id || p.destinations.includes(dest.name));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dest]);

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col p-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{dest.name}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{dest.shortDesc}</p>
        </div>
        <button 
          onClick={() => setView({ name: 'HOME' })}
          className="absolute top-24 left-4 md:left-8 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition"
        >
          <ChevronLeft size={32} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.primary }}>Sobre el destino</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{dest.description}</p>
            
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Atracciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {dest.attractions.map((attr, idx) => (
                <div key={idx} className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.highlight }}></div>
                  <span className="font-medium text-gray-700">{attr}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold mb-2">Viajá a {dest.name}</h3>
              {relatedPackage && (
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <div className="font-bold text-gray-800 mb-1">{relatedPackage.title}</div>
                  <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>${relatedPackage.price} <span className="text-xs text-gray-500">USD</span></div>
                </div>
              )}
              <button 
                onClick={() => relatedPackage ? setView({ name: 'BOOKING', params: relatedPackage }) : window.location.href='#packages'}
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition"
                style={{ backgroundColor: COLORS.secondary }}
              >
                Reservar Paquete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingView = ({ pkg, setView }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', pax: 2
  });

  const total = pkg.price * formData.pax;
  const deposit = total * 0.40;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    // Here we would call createReservation server action
    setTimeout(() => setStep(3), 2500);
  };

  if (step === 3) return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} style={{ color: COLORS.secondary }} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Reserva Confirmada!</h2>
        <p className="text-gray-600 mb-8">Pago de depósito recibido: ${deposit.toFixed(0)} USD</p>
        <button onClick={() => setView({ name: 'HOME' })} className="w-full py-3 rounded-xl font-bold text-white transition" style={{ backgroundColor: COLORS.primary }}>Volver al Inicio</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => setView({ name: 'HOME' })} className="flex items-center text-gray-500 mb-6"><ChevronLeft size={20} /> Volver</button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">{pkg.title}</h3>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t"><span>Total</span><span>${total} USD</span></div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                 <div className="flex justify-between text-sm"><span className="text-blue-800">Anticipo 40%</span><span className="font-bold text-blue-800">${deposit.toFixed(0)} USD</span></div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>Datos de la Reserva</h2>
              {step === 2 ? <div className="text-center py-10">Procesando pago...</div> : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input required type="text" placeholder="Nombre" className="w-full px-4 py-3 rounded-lg border" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <input required type="tel" placeholder="WhatsApp" className="w-full px-4 py-3 rounded-lg border" onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <input required type="date" className="w-full px-4 py-3 rounded-lg border" onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Pasajeros:</span>
                    <input type="number" min="1" value={formData.pax} onChange={e => setFormData({...formData, pax: parseInt(e.target.value)})} className="w-16 px-2 py-2 border rounded" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg" style={{ backgroundColor: '#009EE3' }}>
                    Pagar Anticipo
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN COMPONENTS ---

const AdminLogin = ({ onLogin, setView }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === 'admin123') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-2 border rounded-lg"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">Contraseña incorrecta</p>}
          <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black">Entrar</button>
          <button type="button" onClick={() => setView({name: 'HOME'})} className="w-full text-gray-500 py-2 text-sm">Volver</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ packages, setPackages, destinations, setDestinations, onLogout }) => {
  const [activeTab, setActiveTab] = useState('packages');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (activeTab === 'packages') {
      const newPkg = {
        ...editingItem,
        id: editingItem?.id || `pkg-${Date.now()}`,
        title: data.title,
        price: parseFloat(data.price),
        image: data.image,
        isBestSeller: data.isBestSeller === 'on',
        features: editingItem?.features || [], // Simplify for demo
        destinationId: data.destinationId,
        destinations: ['Florianópolis'] // Mock
      };
      
      if (editingItem) {
        setPackages(packages.map(p => p.id === newPkg.id ? newPkg : p));
      } else {
        setPackages([...packages, newPkg]);
      }
    } else {
       // Destination Logic sim
       const newDest = {
         ...editingItem,
         id: editingItem?.id || `dest-${Date.now()}`,
         name: data.name,
         description: data.description,
         image: data.image
       };
       if (editingItem) {
        setDestinations(destinations.map(d => d.id === newDest.id ? newDest : d));
      } else {
        setDestinations([...destinations, newDest]);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro?')) {
      if (activeTab === 'packages') setPackages(packages.filter(p => p.id !== id));
      else setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <button onClick={onLogout} className="flex items-center text-red-600 hover:text-red-800"><LogOut size={20} className="mr-2"/> Salir</button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex border-b">
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'packages' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('packages')}
            >
              Paquetes
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'destinations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('destinations')}
            >
              Destinos
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
              >
                <Plus size={18} className="mr-2" /> Nuevo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Detalle</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(activeTab === 'packages' ? packages : destinations).map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{item.title || item.name}</td>
                      <td className="p-4 text-gray-500">{activeTab === 'packages' ? `$${item.price}` : item.shortDesc}</td>
                      <td className="p-4 text-right flex justify-end space-x-2">
                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18}/></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold">{editingItem ? 'Editar' : 'Crear'} {activeTab === 'packages' ? 'Paquete' : 'Destino'}</h3>
               <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
             </div>
             <form onSubmit={handleSave} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Nombre / Título</label>
                 <input name="title" defaultValue={editingItem?.title || editingItem?.name} required className="w-full border rounded p-2" />
                 {activeTab === 'destinations' && <input name="name" type="hidden" defaultValue={editingItem?.name} />}
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-1">Imagen URL</label>
                 <input name="image" defaultValue={editingItem?.image} required className="w-full border rounded p-2" />
               </div>

               {activeTab === 'packages' && (
                 <>
                   <div>
                     <label className="block text-sm font-medium mb-1">Precio (USD)</label>
                     <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full border rounded p-2" />
                   </div>
                   <div className="flex items-center space-x-2">
                     <input type="checkbox" name="isBestSeller" defaultChecked={editingItem?.isBestSeller} id="best" />
                     <label htmlFor="best">Es Más Vendido</label>
                   </div>
                   <div>
                      <label className="block text-sm font-medium mb-1">ID Destino</label>
                      <select name="destinationId" defaultValue={editingItem?.destinationId} className="w-full border rounded p-2">
                        {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                   </div>
                 </>
               )}
               
               {activeTab === 'destinations' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea name="description" defaultValue={editingItem?.description} className="w-full border rounded p-2 h-24"></textarea>
                  </div>
               )}

               <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Guardar Cambios</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP ROOT ---

const App = () => {
  const [currentView, setView] = useState({ name: 'HOME', params: null });
  
  // Simulated Database State
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [isAdmin, setIsAdmin] = useState(false);

  // View Router
  const renderView = () => {
    switch(currentView.name) {
      case 'HOME': 
        return <HomeView setView={setView} destinations={destinations} packages={packages} />;
      case 'DESTINATION': 
        return <DestinationView dest={currentView.params} setView={setView} packages={packages} />;
      case 'BOOKING': 
        return <BookingView pkg={currentView.params} setView={setView} />;
      case 'ADMIN_LOGIN':
        return <AdminLogin onLogin={() => { setIsAdmin(true); setView({ name: 'ADMIN' }); }} setView={setView} />;
      case 'ADMIN':
        return isAdmin ? (
          <AdminDashboard 
            packages={packages} 
            setPackages={setPackages}
            destinations={destinations}
            setDestinations={setDestinations}
            onLogout={() => { setIsAdmin(false); setView({ name: 'HOME' }); }} 
          />
        ) : <HomeView setView={setView} destinations={destinations} packages={packages} />; // Fallback
      default: 
        return <HomeView setView={setView} destinations={destinations} packages={packages} />;
    }
  };

  return (
    <div className="font-sans text-gray-800 antialiased bg-white min-h-screen flex flex-col">
      {!currentView.name.includes('ADMIN') && <Navbar setView={setView} />}
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!currentView.name.includes('ADMIN') && (
        <>
          <div className="fixed bottom-6 right-6 z-50">
             <button 
              onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp}`, '_blank')}
              className="rounded-full p-4 shadow-lg hover:shadow-2xl transition transform hover:scale-110 flex items-center justify-center bg-[#25D366]"
            >
              <Phone className="text-white" size={32} />
            </button>
          </div>
          <Footer setView={setView} />
        </>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
