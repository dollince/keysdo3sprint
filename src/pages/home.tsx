import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Team } from '../App';

// ─── Типы ───────────────────────────────────────────────────────
export interface Application {
    id: number;
    teamId: number;
    teamName: string;
    applicantName: string;
    applicantEmail: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
    id: number;
    toEmail: string;
    fromName: string;
    teamName: string;
    text: string;
    read: boolean;
    createdAt: number;
}

export interface UserProfile {
    name: string;
    email: string;
    skills: string;
    description: string;
}

// ─── Утилиты localStorage ───────────────────────────────────────
export const getApplications = (): Application[] =>
    JSON.parse(localStorage.getItem('applications') || '[]');

export const saveApplications = (apps: Application[]) =>
    localStorage.setItem('applications', JSON.stringify(apps));

export const getMessages = (): Message[] =>
    JSON.parse(localStorage.getItem('messages') || '[]');

export const saveMessages = (msgs: Message[]) =>
    localStorage.setItem('messages', JSON.stringify(msgs));

// Все зарегистрированные пользователи
export const getUsers = (): UserProfile[] =>
    JSON.parse(localStorage.getItem('registeredUsers') || '[]');

export const saveUsers = (users: UserProfile[]) =>
    localStorage.setItem('registeredUsers', JSON.stringify(users));

// При логине/регистрации нужно вызывать эту функцию чтобы добавить пользователя в список
export const registerUserProfile = (profile: UserProfile) => {
    const existing = getUsers();
    const updated = existing.filter(u => u.email !== profile.email);
    saveUsers([...updated, profile]);
};

// ─── Модалка просмотра проекта + подача заявки ──────────────────
function ViewTeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleApply = () => {
        const existing = getApplications();
        const newApp: Application = {
            id: Date.now(),
            teamId: team.id,
            teamName: team.name,
            applicantName: localStorage.getItem('userName') || '',
            applicantEmail: localStorage.getItem('userEmail') || '',
            message,
            status: 'pending',
        };
        saveApplications([...existing, newApp]);
        setSent(true);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{team.name}</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    <div className="form-group-combined"><label>Team Name</label><p className="profile-value">{team.name}</p></div>
                    <div className="form-group-combined"><label>Project Goals</label><p className="profile-value">{team.goals || 'Not specified'}</p></div>
                    <div className="form-group-combined"><label>Roles Needed</label><p className="profile-value">{team.roles || 'Not specified'}</p></div>
                    <div className="form-group-combined"><label>Project Description</label><p className="profile-value">{team.description || 'Not specified'}</p></div>

                    {sent ? (
                        <p className="password-success">✓ Application sent successfully!</p>
                    ) : applying ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="form-group-combined">
                                <label>Message to team (optional)</label>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell why you want to join..." rows={3}
                                    style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="cancel-btn" style={{ flex: 1 }} onClick={() => setApplying(false)}>Back</button>
                                <button className="save-btn" style={{ flex: 1 }} onClick={handleApply}>Send Application</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            <button className="cancel-btn" style={{ flex: 1 }} onClick={onClose}>Close</button>
                            <button className="save-btn" style={{ flex: 1 }} onClick={() => setApplying(true)}>Apply</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Модалка заявок для владельца ──────────────────────────────
function AcceptMessageModal({ app, team, onClose, onDone }: {
    app: Application; team: Team; onClose: () => void; onDone: () => void;
}) {
    const [text, setText] = useState('');
    const handleSend = () => {
        const all = getApplications();
        const updated = all.map(a => a.id === app.id ? { ...a, status: 'accepted' as const } : a);
        saveApplications(updated);
        const msgs = getMessages();
        saveMessages([...msgs, {
            id: Date.now(),
            toEmail: app.applicantEmail,
            fromName: localStorage.getItem('userName') || 'Team Owner',
            teamName: team.name,
            text: text.trim() || `Congratulations! You have been accepted to "${team.name}".`,
            read: false,
            createdAt: Date.now(),
        }]);
        onDone();
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Accept & Send Message</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    <div className="form-group-combined">
                        <label>Applicant</label>
                        <p className="profile-value">{app.applicantName}</p>
                    </div>
                    <div className="form-group-combined">
                        <label>Team</label>
                        <p className="profile-value">{team.name}</p>
                    </div>
                    <div className="form-group-combined">
                        <label>Message to applicant</label>
                        <textarea value={text} onChange={(e) => setText(e.target.value)}
                            placeholder={`Congratulations! You have been accepted to "${team.name}".`}
                            rows={4} style={{ background: '#EDF0E8', border: 'none', borderRadius: '0 0 12px 12px', padding: '12px 20px', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="cancel-btn" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                        <button className="save-btn" style={{ flex: 1 }} onClick={handleSend}>Accept & Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ApplicationsModal({ team, onClose }: { team: Team; onClose: () => void }) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>(() =>
        getApplications().filter(a => a.teamId === team.id)
    );
    const [acceptingApp, setAcceptingApp] = useState<Application | null>(null);

    const refreshApps = () => setApplications(getApplications().filter(a => a.teamId === team.id));

    const handleReject = (app: Application) => {
        const all = getApplications();
        const updated = all.map(a => a.id === app.id ? { ...a, status: 'rejected' as const } : a);
        saveApplications(updated);
        const msgs = getMessages();
        saveMessages([...msgs, {
            id: Date.now(),
            toEmail: app.applicantEmail,
            fromName: localStorage.getItem('userName') || 'Team Owner',
            teamName: team.name,
            text: `"${team.name}" has declined your application.`,
            read: false,
            createdAt: Date.now(),
        }]);
        refreshApps();
    };

    if (acceptingApp) {
        return (
            <AcceptMessageModal
                app={acceptingApp}
                team={team}
                onClose={() => setAcceptingApp(null)}
                onDone={() => { setAcceptingApp(null); refreshApps(); }}
            />
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Applications — {team.name}</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    {applications.length === 0 ? (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>No applications yet.</p>
                    ) : (
                        applications.map(app => (
                            <div key={app.id} className="application-card">
                                <div className="application-info">
                                    <strong
                                        style={{ fontSize: '1rem', color: '#2d5a3b', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => { onClose(); navigate(`/profile?user=${encodeURIComponent(app.applicantEmail)}`); }}
                                    >
                                        {app.applicantName || 'Unknown'}
                                    </strong>
                                    <span style={{ color: '#777', fontSize: '0.9rem' }}>{app.applicantEmail}</span>
                                    {app.message && <p style={{ margin: '6px 0 0', color: '#444', fontSize: '0.95rem' }}>{app.message}</p>}
                                </div>
                                <div className="application-status-row">
                                    {app.status === 'pending' ? (
                                        <>
                                            <button className="accept-btn" onClick={() => setAcceptingApp(app)}>Accept</button>
                                            <button className="reject-btn" onClick={() => handleReject(app)}>Reject</button>
                                        </>
                                    ) : (
                                        <span className={`status-badge status-${app.status}`}>
                                            {app.status === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <button className="cancel-btn" style={{ width: '100%', marginTop: '8px' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

// ─── Модалка сообщений ──────────────────────────────────────────
export function MessagesModal({ onClose }: { onClose: () => void }) {
    const myEmail = localStorage.getItem('userEmail') || '';

    const filterMsgs = (all: Message[]) => {
        // Если email задан — фильтруем по нему, иначе показываем все
        const filtered = myEmail ? all.filter(m => m.toEmail === myEmail) : all;
        return filtered.sort((a, b) => b.createdAt - a.createdAt);
    };

    const [messages, setMessages] = useState<Message[]>(() => filterMsgs(getMessages()));

    const markRead = (id: number) => {
        const all = getMessages();
        const updated = all.map(m => m.id === id ? { ...m, read: true } : m);
        saveMessages(updated);
        setMessages(filterMsgs(updated));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Messages</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    {messages.length === 0 ? (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>No messages yet.</p>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                className="message-card"
                                style={{ opacity: msg.read ? 0.6 : 1 }}
                                onClick={() => markRead(msg.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ color: '#2d5a3b' }}>{msg.teamName}</strong>
                                    {!msg.read && <span className="unread-dot" />}
                                </div>
                                <p style={{ margin: '6px 0 0', color: '#444', fontSize: '0.95rem' }}>{msg.text}</p>
                                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>from {msg.fromName}</span>
                            </div>
                        ))
                    )}
                    <button className="cancel-btn" style={{ width: '100%', marginTop: '8px' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

// ─── Главная страница ───────────────────────────────────────────
function HomePage({ teams, onOpenMessages }: { teams: Team[]; onOpenMessages: () => void }) {
    const navigate = useNavigate();
    const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
    const [applicationsTeam, setApplicationsTeam] = useState<Team | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'projects' | 'people'>('projects');

    const ownerTeamIds: number[] = JSON.parse(localStorage.getItem('ownerTeamIds') || '[]');

    const trimmedQuery = searchQuery.trim();

    // Фильтрация проектов
    const filteredTeams = teams.filter(team => {
        if (!trimmedQuery) return true;
        const q = trimmedQuery.toLowerCase();
        return team.name.toLowerCase().includes(q) ||
            (team.description || '').toLowerCase().includes(q) ||
            (team.roles || '').toLowerCase().includes(q) ||
            (team.goals || '').toLowerCase().includes(q);
    });

    // Поиск людей — из registeredUsers в localStorage
    const allUsers = getUsers();
    const filteredPeople = allUsers.filter(user => {
        if (!trimmedQuery) return true;
        const q = trimmedQuery.toLowerCase();
        return (user.name || '').toLowerCase().includes(q) ||
            (user.email || '').toLowerCase().includes(q) ||
            (user.skills || '').toLowerCase().includes(q);
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>

            {/* ── Поиск ── */}
            <div className="search-bar-wrapper">
                <div className="search-type-toggle">
                    <button
                        className={`search-type-btn ${searchType === 'projects' ? 'active' : ''}`}
                        onClick={() => setSearchType('projects')}
                    >Projects</button>
                    <button
                        className={`search-type-btn ${searchType === 'people' ? 'active' : ''}`}
                        onClick={() => setSearchType('people')}
                    >People</button>
                </div>
                <input
                    className="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'projects' ? 'Search by name, tag, description...' : 'Search people by name, email or skills...'}
                />
            </div>

            {/* ── Проекты ── */}
            {searchType === 'projects' && (
                <>
                    <h2 style={{ color: '#5B8064', fontWeight: 600, marginBottom: '20px' }}>
                        {trimmedQuery ? `Results: ${filteredTeams.length}` : 'All Teams'}
                    </h2>
                    {filteredTeams.length === 0 ? (
                        <div className="team-item empty">
                            <p className="empty-text">{trimmedQuery ? 'Nothing found. Try a different query.' : 'No teams yet. Be the first — create one with the + button!'}</p>
                        </div>
                    ) : (
                        <div className="teams-list">
                            {filteredTeams.map(team => (
                                <div className="team-card" key={team.id} onClick={() => setViewingTeam(team)} style={{ cursor: 'pointer' }}>
                                    <div className="team-card-content">
                                        <h4 className="team-card-name">{team.name}</h4>
                                        <p className="team-card-description">{team.description || 'No description'}</p>
                                        {team.roles && (
                                            <div className="team-tags">
                                                {team.roles.split(',').map((r, i) => <span key={i} className="team-tag">{r.trim()}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    {ownerTeamIds.includes(team.id) && (
                                        <button className="applications-btn" title="View applications"
                                            onClick={(e) => { e.stopPropagation(); setApplicationsTeam(team); }}>
                                            Applications
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Люди ── */}
            {searchType === 'people' && (
                <>
                    <h2 style={{ color: '#5B8064', fontWeight: 600, marginBottom: '20px' }}>
                        {trimmedQuery ? `People found: ${filteredPeople.length}` : 'All People'}
                    </h2>
                    {filteredPeople.length === 0 ? (
                        <div className="team-item empty">
                            <p className="empty-text">{trimmedQuery ? 'No people found.' : 'No users registered yet.'}</p>
                        </div>
                    ) : (
                        <div className="teams-list">
                            {filteredPeople.map((person, i) => (
                                <div
                                    className="team-card"
                                    key={i}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile?user=${encodeURIComponent(person.email)}`)}
                                >
                                    <div className="team-card-content">
                                        <h4 className="team-card-name" style={{ color: '#2d5a3b' }}>{person.name || 'Unknown'}</h4>
                                        <p className="team-card-description">{person.email}</p>
                                        {person.skills && (
                                            <div className="team-tags">
                                                {person.skills.split(',').map((s, j) => (
                                                    <span key={j} className="team-tag">{s.trim()}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {viewingTeam && <ViewTeamModal team={viewingTeam} onClose={() => setViewingTeam(null)} />}
            {applicationsTeam && (
                <ApplicationsModal
                    team={applicationsTeam}
                    onClose={() => setApplicationsTeam(null)}
                />
            )}
        </div>
    );
}

export default HomePage;
