import { useState } from 'react';
import type { Team } from '../App';

function ViewTeamModal({ team, onClose }: {
    team: Team;
    onClose: () => void;
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{team.name}</h2>
                    <span className="modal-close" onClick={onClose}>X</span>
                </div>
                <div className="modal-body">
                    <div className="form-group-combined">
                        <label>Team Name</label>
                        <p className="profile-value">{team.name}</p>
                    </div>
                    <div className="form-group-combined">
                        <label>Project Goals</label>
                        <p className="profile-value">{team.goals || 'Not specified'}</p>
                    </div>
                    <div className="form-group-combined">
                        <label>Roles Needed</label>
                        <p className="profile-value">{team.roles || 'Not specified'}</p>
                    </div>
                    <div className="form-group-combined">
                        <label>Project Description</label>
                        <p className="profile-value">{team.description || 'Not specified'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button className="cancel-btn" style={{ flex: 1 }} onClick={onClose}>
                            Close
                        </button>
                        <button className="save-btn" style={{ flex: 1 }} onClick={() => {}}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HomePage({ teams }: { teams: Team[] }) {
    const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ color: '#5B8064', fontWeight: 600, marginBottom: '20px' }}>All Teams</h2>

            {teams.length === 0 ? (
                <div className="team-item empty">
                    <p className="empty-text">No teams yet. Be the first — create one with the + button!</p>
                </div>
            ) : (
                <div className="teams-list">
                    {teams.map(team => (
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
                        </div>
                    ))}
                </div>
            )}

            {viewingTeam && (
                <ViewTeamModal
                    team={viewingTeam}
                    onClose={() => setViewingTeam(null)}
                />
            )}
        </div>
    );
}

export default HomePage;