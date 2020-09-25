import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles, useTheme} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    directionPickerContainer: {},
    directionPickerButton: {
        width: width,
        height: width,
        borderRadius: width / 2,
        background: theme.palette.primary.main + '32',
        border: 'none',
        outline: 'none',
        padding: 0,
        cursor: 'pointer',
        '&:focus': {
            boxShadow: '0 0 3px 2px ' + theme.palette.text.disabled,
        },
    },
    directionPickerLine: {
        pointerEvents: 'none',
    },
});

const width = 32;

const DirectionPicker = ({classes, direction, setDirection}) => {
    const theme = useTheme();
    const [movingDirectionHandle, setMovingDirectionHandle] = React.useState(false);

    const stopMovingAll = () => {
        setMovingDirectionHandle(false);
    };

    const moveHandles = (x: number, y: number) => {
        const originX = x - width / 2;
        const originY = y - width / 2;
        const val = (Math.atan2(-1 * originY, originX) * 180) / Math.PI;

        setDirection(val);
    };

    const handleWindowTouchMove = (event: TouchEvent) => {
        if (movingDirectionHandle) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            const x = event.touches[0].pageX - rect.left;
            const y = event.touches[0].pageY - rect.top;

            moveHandles(x, y);
        }
    };

    const handleWindowMouseMove = (event: MouseEvent) => {
        if (
            movingDirectionHandle &&
            ((event.target as HTMLElement).nodeName.toLowerCase() === 'button' ||
                (event.target as HTMLElement).nodeName.toLowerCase() === 'svg')
        ) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            moveHandles(x, y);
        }
    };

    const handleDirectionHandleStartMoving = event => {
        if (!movingDirectionHandle) {
            event.preventDefault();
            setMovingDirectionHandle(true);

            let startX = 0;
            let startY = 0;
            if (event.type === 'touchstart') {
                const e = event.nativeEvent as TouchEvent;
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                startX = e.touches[0].pageX - rect.left;
                startY = e.touches[0].pageY - rect.top;
            } else if (event.type === 'mousedown') {
                const e = event.nativeEvent as MouseEvent;
                startX = e.offsetX;
                startY = e.offsetY;
            }

            moveHandles(startX, startY);
        }
    };

    React.useEffect(() => {
        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('touchmove', handleWindowTouchMove);

        window.addEventListener('mouseup', stopMovingAll);
        window.addEventListener('touchend', stopMovingAll);
        window.addEventListener('mouseleave', stopMovingAll);
        window.addEventListener('touchcancel', stopMovingAll);

        return function cleanup() {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('touchmove', handleWindowTouchMove);

            window.removeEventListener('mouseup', stopMovingAll);
            window.removeEventListener('touchend', stopMovingAll);
            window.removeEventListener('mouseleave', stopMovingAll);
            window.removeEventListener('touchcancel', stopMovingAll);
        };
    });

    return (
        <div>
            <Tooltip title="Direction of your shadow" placement="right">
                <Typography variant="overline" id="color-picker" gutterBottom>
                    Direction
                </Typography>
            </Tooltip>
            <div className={classes.directionPickerContainer}>
                <button
                    className={classes.directionPickerButton}
                    onMouseDown={handleDirectionHandleStartMoving}
                    onTouchStart={handleDirectionHandleStartMoving}
                >
                    <svg fill="none" width={width} height={width} viewBox={`0 0 ${width} ${width}`}>
                        <line
                            className={classes.directionPickerLine}
                            stroke={theme.palette.primary.main}
                            strokeWidth="3"
                            strokeLinecap="round"
                            x1={width / 2}
                            y1={width / 2}
                            x2={width / 2 + (width / 2) * Math.cos((direction * Math.PI) / 180)}
                            y2={width / 2 + (width / -2) * Math.sin((direction * Math.PI) / 180)}
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default withStyles(styles)(DirectionPicker);
