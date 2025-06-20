import React, { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';
import { getImage, StaticImage } from 'gatsby-plugin-image';
import { useImmer } from 'use-immer';
import { Mutex } from 'async-mutex';
import { text } from 'stream/consumers';

const largeWindowThreshold = 1248;
const mediumWindowThreshold = 768;
const smallWindowThreshold = 580;
const xSmallWindowThreshold = 300;

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  const windowThreshold =
    innerWidth > largeWindowThreshold
      ? largeWindowThreshold
      : innerWidth > mediumWindowThreshold
        ? mediumWindowThreshold
        : innerWidth > smallWindowThreshold
          ? smallWindowThreshold
          : xSmallWindowThreshold;

  const gameSize = mediumWindowThreshold;
  return {
    innerWidth,
    innerHeight,
    gameSize: gameSize,
    windowThreshold: windowThreshold,
    upperGameYAxis: (gameSize * 0.688) / 3 + 50,
    lowerGameYAxis: ((gameSize * 0.688) / 3) * 2,
    middleGameXAxis: gameSize / 2,
    leftGameXAxis: gameSize / 3 - 15,
    rightGameXAxis: (gameSize / 3) * 2 + 15,

    //can't use calulated values with gatsbyImage
    largeSpriteSize: gameSize / 13,
    mediumSpriteSize: gameSize / 15,
    smallSpriteSize: gameSize / 20,
  };
}

const Game: React.FC = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const defaultGameState = {
    activeItem: '',
    items: {
      fire1: {
        location: {
          x: windowSize.leftGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      fire2: {
        location: {
          x: windowSize.rightGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      sword: {
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.lowerGameYAxis - 50,
        },
      },
    },
    npcs: {
      sage: {
        status: 'alive',
        alignment: 'good',
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      link: {
        status: 'alive',
        alignment: 'good',
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.lowerGameYAxis,
        },
      },
      fairy: {
        status: 'alive',
        alignment: 'good',
        location: {
          x: windowSize.leftGameXAxis,
          y: windowSize.lowerGameYAxis,
        },
      },
    },
    text: {
      text: '',
      location: {
        x: windowSize.middleGameXAxis,
        y: windowSize.upperGameYAxis - 75,
      },
    },
    linkFollowed: false,
  };
  const fairyMutex = new Mutex();
  const [gameState, setGameState] = useImmer(defaultGameState);

  function killLink(): void {
    console.debug('killing link');
    setGameState(draft => {
      draft.npcs.link.status = 'dead';
    });
  }

  function killSage(): void {
    console.debug('killing sage');
    setGameState(draft => {
      draft.npcs.sage.status = 'dead';
    });
  }

  function killFairy(): void {
    console.debug('killing fairy');
    setGameState(draft => {
      draft.npcs.fairy.status = 'dead';
    });
  }

  function reviveLink(): void {
    console.debug('reviving link');
    fairyMutex.runExclusive(async () => {
      setGameState(draft => {
        draft.activeItem = '';
        draft.npcs.fairy = defaultGameState.npcs.fairy;
        draft.npcs.link.status = 'alive';
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate some delay to hold the mutex
    });
  }

  function reviveSage(): void {
    console.debug('reviving sage');
    fairyMutex.runExclusive(async () => {
      setGameState(draft => {
        draft.activeItem = '';
        draft.npcs.fairy = defaultGameState.npcs.fairy;
        draft.npcs.sage.status = 'alive';
        draft.npcs.sage.alignment = 'evil';
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate some delay to hold the mutex
    });
  }

  function burnFairy(): void {
    console.debug('burning fairy');
    setGameState(draft => {
      draft.npcs.fairy.status = 'onFire';
    });
  }

  const gameRef = useRef<HTMLDivElement | null>(null);

  const move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (gameRef.current !== null) {
      var rect = gameRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width - 20);
      const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height - 20);
      if (gameState.activeItem === 'sword') {
        setGameState(draft => {
          draft.items.sword.location = { x: x, y: y };
        });
      } else if (gameState.activeItem === 'fairy') {
        if (!fairyMutex.isLocked()) {
          setGameState(draft => {
            draft.npcs.fairy.location = { x: x, y: y };
          });
        }
      }
    }
  };

  function windowIsTooSmall() {
    return mediumWindowThreshold > windowSize.windowThreshold;
  }

  return (
    <div>
      {windowIsTooSmall() && (
        <div className="game-warning">
          <p>
            This game is best played on a larger screen. Please resize your browser window or use a
            larger device.
          </p>
        </div>
      )}
      {!windowIsTooSmall() && (
        <div
          id="game-zone"
          ref={gameRef}
          style={{
            cursor: gameState.activeItem !== '' ? 'none' : 'default',
            width: windowSize.gameSize,
          }}
          onMouseMove={move}
        >
          <div
            className="game-text"
            style={{
              left: gameState.text.location.x,
              top: gameState.text.location.y,
            }}
            onClick={() => {}}
            onMouseEnter={() => {
              gameState.activeItem === 'fairy' && burnFairy();
            }}
          >
            <StaticImage
              src="../images/dangerDanger.png"
              alt="words to live by"
              placeholder="blurred"
              height={60}
            />
          </div>
          <div
            className="cursor"
            style={{
              left: gameState.items.sword.location.x,
              top: gameState.items.sword.location.y,
            }}
            onClick={() => {
              console.debug('sword clicked');
              if (gameState.activeItem !== 'sword') {
                console.debug('picking up the sword');
                setGameState(draft => {
                  draft.activeItem = 'sword';
                });
              } else {
                console.debug('dropping the sword');
                setGameState(draft => {
                  draft.activeItem = '';
                });
              }
            }}
          >
            <StaticImage
              src="../images/dangerCursor.png"
              alt="It's a dangerous gift"
              placeholder="blurred"
              height={40}
            />
          </div>
          <div
            className="game-item"
            style={{
              left: gameState.items.fire1.location.x,
              top: gameState.items.fire1.location.y,
            }}
            onClick={() => {}}
            onMouseEnter={() => {
              gameState.activeItem === 'fairy' && burnFairy();
            }}
          >
            <StaticImage
              src="../images/dangerFire.png"
              alt="Hot hot hot"
              placeholder="blurred"
              height={60}
            />
          </div>
          <div
            className="game-item"
            style={{
              left: gameState.items.fire2.location.x,
              top: gameState.items.fire2.location.y,
            }}
            onClick={() => {}}
            onMouseEnter={() => {
              gameState.activeItem === 'fairy' && burnFairy();
            }}
          >
            <StaticImage
              src="../images/dangerFire.png"
              alt="Hot hot hot"
              placeholder="blurred"
              height={60}
            />
          </div>

          <div
            className="game-npc"
            style={{
              left: gameState.npcs.sage.location.x,
              top: gameState.npcs.sage.location.y,
              cursor: gameState.activeItem === 'sword' ? 'none' : 'default',
            }}
            aria-label="a wise sage"
            onMouseEnter={() => {
              gameState.activeItem === 'sword' && killSage();
              gameState.activeItem === 'fairy' &&
                gameState.npcs.fairy.status === 'alive' &&
                reviveSage();
            }}
          >
            <StaticImage
              src="../images/dangerSage.png"
              alt="an old man"
              placeholder="blurred"
              style={{ display: gameState.npcs.sage.status === 'alive' ? 'block' : 'none' }}
              height={50}
            />
            <StaticImage
              src="../images/dangerSage.png"
              alt="an old man - dead"
              placeholder="blurred"
              transformOptions={{ rotate: -90 }}
              style={{ display: gameState.npcs.sage.status === 'dead' ? 'block' : 'none' }}
              height={50}
            />
          </div>
          <Link
            className="link-hero-of-time game-npc"
            style={{
              left: gameState.npcs.link.location.x,
              top: gameState.npcs.link.location.y,
              cursor: gameState.activeItem === 'sword' ? 'none' : 'default',
            }}
            to={gameState.npcs.link.status === 'dead' ? '/DeadLink' : '/HeroOfTime'}
            aria-label="Hero of Time link"
            onMouseEnter={() => {
              gameState.activeItem === 'sword' && killLink();
              gameState.activeItem === 'fairy' &&
                gameState.npcs.fairy.status === 'alive' &&
                reviveLink();
            }}
          >
            <StaticImage
              src="../images/dangerLink.png"
              alt="the hero of time"
              placeholder="blurred"
              style={{ display: gameState.npcs.link.status === 'alive' ? 'block' : 'none' }}
              height={50}
            />
            <StaticImage
              src="../images/dangerLink.png"
              alt="the hero of time - dead"
              placeholder="blurred"
              transformOptions={{ rotate: -90 }}
              style={{ display: gameState.npcs.link.status === 'dead' ? 'block' : 'none' }}
              height={50}
            />
          </Link>
          <div
            className="cursor fairy-of-the-fountain"
            style={{
              left: gameState.npcs.fairy.location.x,
              top: gameState.npcs.fairy.location.y,
            }}
            onMouseEnter={() => {
              gameState.activeItem === 'sword' && killFairy();
            }}
          >
            <div
              onClick={() => {
                if (gameState.activeItem !== 'fairy') {
                  console.debug('picking up the fairy');
                  setGameState(draft => {
                    draft.activeItem = 'fairy';
                  });
                } else {
                  console.debug('dropping the fairy');
                  setGameState(draft => {
                    draft.activeItem = '';
                  });
                }
              }}
            >
              <StaticImage
                src="../images/dangerFairy.png"
                alt="Fairy of the Fountain"
                placeholder="blurred"
                height={40}
                style={{
                  display:
                    gameState.npcs.link.status === 'dead' && gameState.npcs.fairy.status === 'alive'
                      ? 'block'
                      : 'none',
                }}
              />
              <StaticImage
                src="../images/dangerFairy.png"
                alt="Fairy - Dead"
                placeholder="blurred"
                transformOptions={{ rotate: -90 }}
                height={40}
                style={{
                  display: gameState.npcs.fairy.status === 'dead' ? 'block' : 'none',
                }}
              />
              <StaticImage
                src="../images/dangerFire.png"
                alt="Hot hot hot fairy"
                placeholder="blurred"
                height={40}
                style={{
                  display: gameState.npcs.fairy.status === 'onFire' ? 'block' : 'none',
                }}
              />
            </div>
          </div>
          <div>
            <StaticImage
              src="../images/dangerBackground.png"
              alt="A simple, yet classic background"
              placeholder="blurred"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
