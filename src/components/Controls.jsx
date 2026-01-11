import { useAnimationStore } from '../store/animationStore'

/**
 * Controls Panel Component
 * Provides animation selection, speed slider, and playback controls
 */
export function Controls({ onPlaySequence, onPlayAction, availableActions = [] }) {
    const {
        animations,
        current,
        setCurrent,
        isManualMode,
        toggleManualMode,
        speed,
        setSpeed,
        playingAction
    } = useAnimationStore()

    const handleAnimationChange = (e) => {
        const selected = animations.find(anim => anim.name === e.target.value)
        setCurrent(selected || null)
    }

    const handleSpeedChange = (e) => {
        setSpeed(parseFloat(e.target.value))
    }

    return (
        <div className="controls-panel">
            {/* Animation Selection */}
            <div className="control-group">
                <label>Animation</label>
                <select
                    value={current?.name || ''}
                    onChange={handleAnimationChange}
                >
                    <option value="">Select an animation...</option>
                    {animations.map((anim, index) => (
                        <option key={`${anim.name || anim._filename || index}-${index}`} value={anim.name}>
                            {anim.name || 'Unnamed Animation'}
                        </option>
                    ))}
                </select>
                {current?.description && (
                    <small style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {current.description}
                    </small>
                )}
            </div>

            {/* Speed Control */}
            <div className="control-group">
                <label>Playback Speed</label>
                <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={handleSpeedChange}
                />
                <div className="speed-display">{speed.toFixed(1)}x</div>
            </div>

            {/* Playback Mode */}
            {current && (
                <>
                    <div className="control-group">
                        <label>Playback Mode</label>
                        <div className="button-group">
                            <button
                                className="btn btn-primary"
                                onClick={() => onPlaySequence(current)}
                            >
                                ▶ Sequence
                            </button>
                            <button
                                className={`btn btn-secondary ${isManualMode ? 'active' : ''}`}
                                onClick={toggleManualMode}
                            >
                                🎛 Manual
                            </button>
                        </div>
                    </div>

                    {/* Manual Action Buttons */}
                    {isManualMode && (
                        <div className="control-group">
                            <div className="section-title">Actions</div>
                            <div className="action-buttons">
                                {(current.actions || availableActions).map((actionName) => (
                                    <button
                                        key={actionName}
                                        className={`btn-action ${playingAction === actionName ? 'playing' : ''}`}
                                        onClick={() => onPlayAction(actionName)}
                                    >
                                        {actionName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* No Animation Selected */}
            {!current && animations.length > 0 && (
                <div className="no-animation">
                    Select an animation to begin
                </div>
            )}

            {animations.length === 0 && (
                <div className="no-animation">
                    No animations found in /src/animations/
                </div>
            )}
        </div>
    )
}

export default Controls
