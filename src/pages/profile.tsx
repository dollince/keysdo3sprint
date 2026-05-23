import React, { useState, useEffect } from 'react';
import './profile.css';
import type { Team } from '../App';

interface ProfileProps {
    teams: Team[];
    onTeamsChange: (teams: Team[]) => void;
}

const Profile: React.FC<ProfileProps> = ({ teams, onTeamsChange }) => {
    const [name, setName] = useState(() => localStorage.getItem('userName') || '');
    const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || '');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');

    const [tempData, setTempData] = useState({ name: '', email: '', skills: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [editTeamData, setEditTeamData] = useState<Omit<Team, 'id'>>({
        name: '', goals: '', roles: '', description: ''
    });

    const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(res => res.json())
                .then(data => {
                    const fetchedName = data.name || '';
                    const fetchedEmail = data.email || '';
                    setName(fetchedName);
                    setEmail(fetchedEmail);
                    setSkills(data.skills || '');
                    setDescription(data.description || '');
                    // Сохраняем в localStorage чтобы не пропадало
                    localStorage.setItem('userName', fetchedName);
                    localStorage.setItem('userEmail', fetchedEmail);
                })
                .catch(() => console.log("Бэкенд недоступен"));
        }
    }, []);

    const startEditing = () => {
        setTempData({ name, email, skills, description });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setName(tempData.name);
        setEmail(tempData.email);
        setSkills(tempData.skills);
        setDescription(tempData.description);
        setIsEditing(false);
    };

    const handleSave = () => {
        setIsEditing(false);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        console.log('Данные сохранены:', { name, email, skills, description });
    };

    const openPasswordModal = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (response.ok) {
                setPasswordSuccess('Password changed successfully!');
                setTimeout(() => closePasswordModal(), 1500);
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setPasswordError(data.message || 'Error changing password.');
                } else {
                    const text = await response.text();
                    setPasswordError(text || 'Error changing password.');
                }
            }
        } catch {
            setPasswordError('Server is unavailable. Try again later.');
        }
    };

    const openEditTeam = (team: Team) => {
        setEditingTeam(team);
        setEditTeamData({ name: team.name, goals: team.goals, roles: team.roles, description: team.description });
    };

    const closeEditTeam = () => {
        setEditingTeam(null);
    };

    const handleSaveTeam = () => {
        if (!editingTeam) return;
        const updated = teams.map(t =>
            t.id === editingTeam.id ? { ...t, ...editTeamData } : t
        );
        onTeamsChange(updated);
        closeEditTeam();
    };

    const handleDeleteTeam = () => {
        if (!editingTeam) return;
        const updated = teams.filter(t => t.id !== editingTeam.id);
        onTeamsChange(updated);
        closeEditTeam();
    };

    return (
        <div className="profile-container">
            <div className="profile-card">

                <div className="profile-field">
                    <label>Name</label>
                    {isEditing ? (
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                        <p className="profile-value">{name || 'Not specified'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Mail</label>
                    {isEditing ? (
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                        <p className="profile-value">{email || 'Not specified'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Skills</label>
                    {isEditing ? (
                        <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} />
                    ) : (
                        <p className="profile-value">{skills || 'Not specified'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Description</label>
                    {isEditing ? (
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                    ) : (
                        <p className="profile-value">{description || 'Not specified'}</p>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            <button className="save-btn" onClick={handleSave}>Save Changes</button>
                        </>
                    ) : (
                        <>
                            <button className="change-pass-btn" onClick={openPasswordModal}>Change Password</button>
                            <button className="edit-btn" onClick={startEditing}>Edit Profile</button>
                            <button className="logout-btn" onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('userName');
                                localStorage.removeItem('userEmail');
                                window.location.href = '/';
                            }}>Log Out</button>
                        </>
                    )}
                </div>

                <div className="teams-section">
                    <h3 className="teams-title">My Teams</h3>
                    <div className="teams-list">
                        {teams.length === 0 ? (
                            <div className="team-item empty">
                                <p className="empty-text">No teams yet. Create your first team with the + button!</p>
                            </div>
                        ) : (
                            teams.map(team => (
                                <div
                                    className="team-card"
                                    key={team.id}
                                    onClick={() => setViewingTeam(team)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="team-card-content">
                                        <h4 className="team-card-name">{team.name}</h4>
                                        <p className="team-card-description">{team.description || 'No description'}</p>
                                    </div>
                                    <button
                                        className="team-edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditTeam(team);
                                        }}
                                        title="Edit team"
                                    >
                                        ✎
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Модалка просмотра команды */}
            {viewingTeam && (
                <div className="modal-overlay" onClick={() => setViewingTeam(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{viewingTeam.name}</h2>
                            <span className="modal-close" onClick={() => setViewingTeam(null)}>X</span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group-combined">
                                <label>Team Name</label>
                                <p className="profile-value">{viewingTeam.name}</p>
                            </div>
                            <div className="form-group-combined">
                                <label>Project Goals</label>
                                <p className="profile-value">{viewingTeam.goals || 'Not specified'}</p>
                            </div>
                            <div className="form-group-combined">
                                <label>Roles Needed</label>
                                <p className="profile-value">{viewingTeam.roles || 'Not specified'}</p>
                            </div>
                            <div className="form-group-combined">
                                <label>Project Description</label>
                                <p className="profile-value">{viewingTeam.description || 'Not specified'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button className="cancel-btn" style={{ flex: 1 }} onClick={() => setViewingTeam(null)}>
                                    Close
                                </button>
                                <button className="save-btn" style={{ flex: 1 }} onClick={() => {}}>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка смены пароля */}
            {isPasswordModalOpen && (
                <div className="modal-overlay" onClick={closePasswordModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Change Password</h2>
                            <span className="modal-close" onClick={closePasswordModal}>X</span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group-combined">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="enter"
                                />
                            </div>
                            <div className="form-group-combined">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="enter"
                                />
                            </div>
                            <div className="form-group-combined">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="enter"
                                />
                            </div>
                            {passwordError && <p className="password-error">{passwordError}</p>}
                            {passwordSuccess && <p className="password-success">{passwordSuccess}</p>}
                            <button className="save-btn modal-save-btn" onClick={handlePasswordChange}>
                                Save Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка редактирования команды */}
            {editingTeam && (
                <div className="modal-overlay" onClick={closeEditTeam}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Team</h2>
                            <span className="modal-close" onClick={closeEditTeam}>X</span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group-combined">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    value={editTeamData.name}
                                    onChange={(e) => setEditTeamData({ ...editTeamData, name: e.target.value })}
                                    placeholder="enter team name"
                                />
                            </div>
                            <div className="form-group-combined">
                                <label>Project Goals</label>
                                <textarea
                                    value={editTeamData.goals}
                                    onChange={(e) => setEditTeamData({ ...editTeamData, goals: e.target.value })}
                                    placeholder="what do you want to achieve?"
                                    rows={3}
                                    style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', fontSize: '1rem', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div className="form-group-combined">
                                <label>Roles Needed</label>
                                <input
                                    type="text"
                                    value={editTeamData.roles}
                                    onChange={(e) => setEditTeamData({ ...editTeamData, roles: e.target.value })}
                                    placeholder="e.g. designer, backend dev..."
                                />
                            </div>
                            <div className="form-group-combined">
                                <label>Project Description</label>
                                <textarea
                                    value={editTeamData.description}
                                    onChange={(e) => setEditTeamData({ ...editTeamData, description: e.target.value })}
                                    placeholder="describe your project..."
                                    rows={4}
                                    style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', fontSize: '1rem', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div className="team-modal-actions">
                                <button className="cancel-btn" onClick={closeEditTeam}>Cancel</button>
                                <button className="delete-team-btn" onClick={handleDeleteTeam}>Delete</button>
                                <button className="save-btn" onClick={handleSaveTeam}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;