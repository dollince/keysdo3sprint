import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate
} from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import HomePage from './pages/home';

import './pages/profile.css';
import { MessagesModal, getMessages } from './pages/home';

export interface Team {
    id: number;
    name: string;
    goals: string;
    roles: string;
    description: string;
}

function CreateTeamModal({
    onClose,
    onSave
}: {
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

        onSave({
            name: teamName,
            goals,
            roles,
            description
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">Create Team</h2>

                    <span className="modal-close" onClick={onClose}>
                        X
                    </span>
                </div>

                <div className="modal-body">
                    <div className="form-group-combined">
                        <label>Team Name</label>

                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="enter team name"
                        />
                    </div>

                    <div className="form-group-combined">
                        <label>Project Goals</label>

                        <textarea
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            placeholder="what do you want to achieve?"
                            rows={3}
                            style={{
                                background: '#EDF0E8',
                                border: 'none',
                                borderRadius: '0 0 12px 12px',
                                padding: '12px 20px',
                                color: '#333',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group-combined">
                        <label>Roles Needed</label>

                        <input
                            type="text"
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                            placeholder="e.g. designer, backend dev..."
                        />
                    </div>

                    <div className="form-group-combined">
                        <label>Project Description</label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="describe your project..."
                            rows={4}
                            style={{
                                background: '#EDF0E8',
                                border: 'none',
                                borderRadius: '0 0 12px 12px',
                                padding: '12px 20px',
                                color: '#333',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {error && (
                        <p className="password-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="save-btn modal-save-btn"
                        onClick={handleSave}
                    >
                        Create Team
                    </button>
                </div>
            </div>
        </div>
    );
}

function NeedAuthModal({
    onClose
}: {
    onClose: () => void;
}) {
    const navigate = useNavigate();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">
                        Sign in required
                    </h2>

                    <span
                        className="modal-close"
                        onClick={onClose}
                    >
                        X
                    </span>
                </div>

                <div className="modal-body">
                    <p
                        style={{
                            color: '#555',
                            margin: 0
                        }}
                    >
                        To access this page you need to log in.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '16px'
                        }}
                    >
                        <button
                            className="cancel-btn"
                            style={{ flex: 1 }}
                            onClick={() => {
                                onClose();
                                navigate('/login');
                            }}
                        >
                            Log in
                        </button>

                        <button
                            className="save-btn"
                            style={{ flex: 1 }}
                            onClick={() => {
                                onClose();
                                navigate('/register');
                            }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        true // ВРЕМЕННО: всегда залогинен для просмотра UI
        // !!localStorage.getItem('token')
    );

    const [teams, setTeams] = useState<Team[]>([]);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);

    const getUnreadCount = () => {
        const myEmail = localStorage.getItem('userEmail') || '';
        return getMessages().filter(m => m.toEmail === myEmail && !m.read).length;
    };
    const [unreadCount, setUnreadCount] = useState(getUnreadCount);


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            const publicPaths = [
                '/',
                '/login',
                '/register'
            ];

            if (!token) {
                // setIsLoggedIn(false); // ВРЕМЕННО: не сбрасываем статус

                // ВРЕМЕННО закомментировано для просмотра UI без авторизации
                // if (
                //     !publicPaths.includes(location.pathname)
                // ) {
                //     navigate('/login', {
                //         replace: true
                //     });
                // }

                return;
            }

            try {
                const response = await fetch(
                    'http://localhost:8080/api/users/me',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem('token');

                    // setIsLoggedIn(false); // ВРЕМЕННО: не сбрасываем статус

                    // ВРЕМЕННО закомментировано для просмотра UI без авторизации
                    // if (
                    //     !publicPaths.includes(
                    //         location.pathname
                    //     )
                    // ) {
                    //     navigate('/login', {
                    //         replace: true
                    //     });
                    // }
                }
            } catch (err) {
                console.error(
                    'Auth check failed:',
                    err
                );

                // setIsLoggedIn(false); // ВРЕМЕННО: не сбрасываем статус
            }
        };

        const fetchTeams = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8080/api/teams'
                );

                if (response.ok) {
                    const data = await response.json();

                    setTeams(data);
                }
            } catch (err) {
                console.error(
                    'Fetch teams failed:',
                    err
                );
            }
        };

        void checkAuth();
        void fetchTeams();
    }, [location.pathname, navigate]);

    // =========================
    // SAVE TEAM
    // =========================

    const handleSaveNewTeam = async (
        teamData: Omit<Team, 'id'>
    ) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                'http://localhost:8080/api/teams',
                {
                    method: 'POST',

                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify(teamData)
                }
            );

            if (response.ok) {
                const savedTeam =
                    await response.json();

                setTeams((prev) => [
                    ...prev,
                    savedTeam
                ]);

                setIsCreateTeamOpen(false);
            }
        } catch (err) {
            console.error(
                'Save team failed:',
                err
            );
            // ВРЕМЕННО: бэкенд недоступен — сохраняем локально
            const localTeam: Team = { id: Date.now(), ...teamData };
            setTeams((prev) => [...prev, localTeam]);
            setIsCreateTeamOpen(false);
        }
    };

    const handleTeamsChange = async () => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/teams'
            );

            if (response.ok) {
                const data = await response.json();

                setTeams(data);
            }
        } catch (err) {
            console.error(
                'Fetch teams failed:',
                err
            );
        }
    };

    const isHomePage = location.pathname === '/';

    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                onMessages={() => { setIsMessagesOpen(true); setUnreadCount(0); }}
                unreadCount={unreadCount}
                onProfile={() =>
                    isLoggedIn
                        ? navigate('/profile')
                        : setIsAuthModalOpen(true)
                }
                onCreateTeam={
                    isHomePage
                        ? () =>
                              isLoggedIn
                                  ? setIsCreateTeamOpen(
                                        true
                                    )
                                  : setIsAuthModalOpen(
                                        true
                                    )
                        : undefined
                }
            />

            <div style={{ paddingTop: '60px' }}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage teams={teams} onOpenMessages={() => { setIsMessagesOpen(true); setUnreadCount(0); }} />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/profile"
                        element={
                            isLoggedIn ? (
                                <Profile
                                    teams={teams}
                                    onTeamsChange={
                                        handleTeamsChange
                                    }
                                />
                            ) : (
                                <HomePage teams={teams} onOpenMessages={() => { setIsMessagesOpen(true); setUnreadCount(0); }} />
                            )
                        }
                    />
                </Routes>
            </div>

            {isCreateTeamOpen && (
                <CreateTeamModal
                    onClose={() =>
                        setIsCreateTeamOpen(false)
                    }
                    onSave={handleSaveNewTeam}
                />
            )}

            {isAuthModalOpen && (
                <NeedAuthModal
                    onClose={() =>
                        setIsAuthModalOpen(false)
                    }
                />
            )}

            {isMessagesOpen && (
                <MessagesModal onClose={() => setIsMessagesOpen(false)} />
            )}
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
