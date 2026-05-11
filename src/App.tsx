import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from "./components/PrivateRoute.tsx";
import Profile from './pages/profile';
import HomePage from './pages/home';
import './pages/profile.css';

export interface Team {
    id: number;
    name: string;
    goals: string;
    roles: string;
    description: string;
}

function CreateTeamModal({ onClose, onSave }: {
    onClose: () => void;
    onSave: (team: Omit<Team, 'id'>) => void;
}) {
    const [teamName, setTeamName] = useState('');
    const [goals, setGoals] = useState('');
    const [roles, setRoles] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!teamName.trim()) {
            setError('Please enter a team name.');
            return;
        }
        onSave({ name: teamName, goals, roles, description });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create Team</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    <div className="form-group-combined">
                        <label>Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div className="form-group-combined">
                        <label>Project Goals</label>
                        <textarea
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            placeholder=""
                            rows={3}
                            style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', fontSize: '1rem', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div className="form-group-combined">
                        <label>Roles Needed</label>
                        <input
                            type="text"
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    <div className="form-group-combined">
                        <label>Project Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder=""
                            rows={4}
                            style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', fontSize: '1rem', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                    {error && <p className="password-error">{error}</p>}
                    <button className="save-btn modal-save-btn" onClick={handleSave}>
                        Create Team
                    </button>
                </div>
            </div>
        </div>
    );
}

function AppContent() {
    const location = useLocation();
    const [userName, setUserName] = useState<string>('Гость');
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

    const [teams, setTeams] = useState<Team[]>(() => {
        const saved = localStorage.getItem('myTeams');
        return saved ? JSON.parse(saved) : [];
    });

    const saveTeams = (newTeams: Team[]) => {
        setTeams(newTeams);
        localStorage.setItem('myTeams', JSON.stringify(newTeams));
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("Нет токена");
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const user = await response.json();
                    setUserName(user.name);
                } else {
                    console.log("Токен недействителен");
                }
            } catch (err) {
                console.error("Ошибка при проверке авторизации:", err);
            }
        };
        checkAuth();
    }, []);

    const isHomePage = location.pathname === '/';

    return (
        <>
            <Header onCreateTeam={isHomePage ? () => setIsCreateTeamOpen(true) : undefined} />
            <div style={{ paddingTop: '60px' }}>
                <Routes>
                    <Route path="/" element={
                        <HomePage teams={teams} />
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={
                        <Profile teams={teams} onTeamsChange={saveTeams} />
                    } />
                    <Route element={<PrivateRoute />}>
                    </Route>
                </Routes>
            </div>

            {isCreateTeamOpen && (
                <CreateTeamModal
                    onClose={() => setIsCreateTeamOpen(false)}
                    onSave={(team) => {
                        const newTeams = [...teams, { ...team, id: Date.now() }];
                        saveTeams(newTeams);
                        setIsCreateTeamOpen(false);
                    }}
                />
            )}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;