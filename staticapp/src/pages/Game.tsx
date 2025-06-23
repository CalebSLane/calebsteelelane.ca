import React, { useState, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';
import { StaticImage } from 'gatsby-plugin-image';
import { useImmer } from 'use-immer';
import { Mutex } from 'async-mutex';

const largeWindowThreshold = 1248;
const mediumWindowThreshold = 768;
const smallWindowThreshold = 580;
const xSmallWindowThreshold = 300;

function getWindowSize() {
  const gameSize = mediumWindowThreshold;
  const windowSize = {
    gameSize: gameSize,
    innerWidth: 0,
    innerHeight: 0,
    windowThreshold: mediumWindowThreshold,
    upperGameYAxis: (gameSize * 0.688) / 3 + 50,
    lowerGameYAxis: ((gameSize * 0.688) / 3) * 2,
    topGameYAxis: 0,
    bottomGameYAxis: gameSize * 0.688,
    middleGameXAxis: gameSize / 2,
    leftThirdGameXAxis: gameSize / 3 - 15,
    rightThirdGameXAxis: (gameSize / 3) * 2 + 15,
    leftGameXAxis: 0,
    rightGameXAxis: gameSize,

    //can't use calulated values with gatsbyImage
    largeSpriteSize: 60,
    mediumSpriteSize: 50,
    smallSpriteSize: 40,
  };
  if (typeof window !== 'undefined') {
    const { innerWidth, innerHeight } = window;
    const windowThreshold =
      innerWidth > largeWindowThreshold
        ? largeWindowThreshold
        : innerWidth > mediumWindowThreshold
          ? mediumWindowThreshold
          : innerWidth > smallWindowThreshold
            ? smallWindowThreshold
            : xSmallWindowThreshold;

    windowSize.windowThreshold = windowThreshold;
    windowSize.innerWidth = innerWidth;
    windowSize.innerHeight = innerHeight;
  }
  return windowSize;
}

const Game: React.FC = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, []);

  let defaultSwordState = 'normal';
  let defaultGunState = 'unavailable';
  if (isMobile) {
    defaultSwordState = 'stolen';
    defaultGunState = 'available';
    // Device has a mouse
  }

  const defaultGameState = {
    activeItem: '',
    activePC: '',
    items: {
      magicBarrier: {
        status: 'active',
        height: windowSize.largeSpriteSize,
        width: windowSize.largeSpriteSize,
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      fire1: {
        location: {
          x: windowSize.leftThirdGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      fire2: {
        location: {
          x: windowSize.rightThirdGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      sword: {
        status: defaultSwordState,
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.lowerGameYAxis - 50,
        },
      },
      gun: {
        status: defaultGunState,
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
        height: windowSize.mediumSpriteSize,
        width: 40,
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.upperGameYAxis,
        },
      },
      link: {
        status: 'alive',
        alignment: 'good',
        height: windowSize.mediumSpriteSize,
        width: 40,
        location: {
          x: windowSize.middleGameXAxis,
          y: windowSize.lowerGameYAxis,
        },
      },
      fairy: {
        status: 'alive',
        alignment: 'good',
        height: windowSize.smallSpriteSize,
        width: 30,
        location: {
          x: windowSize.leftThirdGameXAxis,
          y: windowSize.lowerGameYAxis,
        },
      },
    },
    text: {
      text: '',
      location: {
        x: windowSize.middleGameXAxis,
        y: windowSize.upperGameYAxis - 75,
        height: windowSize.largeSpriteSize,
      },
    },
    //todo add events array and add events to it for sequence of game rules
  };
  const fairyMutex = new Mutex();
  const [gameState, setGameState] = useImmer(defaultGameState);

  function killLink(): void {
    console.debug('killing link');
    setGameState(draft => {
      draft.npcs.link.status = 'dead';
    });
  }

  function killFairy(): void {
    console.debug('killing fairy');
    setGameState(draft => {
      draft.npcs.fairy.status = 'dead';
    });
  }

  function killSage(method?: string): void {
    if (gameState.items.magicBarrier.status === 'active' && method === 'sword') {
      console.debug("can't kill sage with sword while barrier is up");
    } else {
      console.debug('killing sage');
      setGameState(draft => {
        draft.npcs.sage.status = 'dead';
      });
    }
  }

  function disableSageBarrier(): void {
    console.debug('disabling sage barrier');
    setGameState(draft => {
      draft.items.magicBarrier.status = 'inactive';
    });
  }

  function enableSageBarrier(): void {
    console.debug('enabling sage barrier');
    setGameState(draft => {
      draft.items.magicBarrier.status = 'active';
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
        draft.items.magicBarrier.status = 'active';
        draft.npcs.fairy = defaultGameState.npcs.fairy;
        draft.npcs.sage.status = 'alive';
        draft.npcs.sage.alignment = 'evil';
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate some delay to hold the mutex
    });
  }

  function burnFairy(): void {
    console.debug('burning fairy');
    if (gameState.npcs.fairy.status !== 'ash') {
      setGameState(draft => {
        draft.npcs.fairy.status = 'onFire';
      });
      setTimeout(() => {
        setGameState(draft => {
          draft.activeItem = draft.activeItem === 'fairy' ? '' : draft.activeItem;
          draft.npcs.fairy.status = 'ash';
        });
      }, 1 * 1000);
    }
  }

  const swordCoolTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function heatSword(): void {
    console.debug('heating sword');
    setGameState(draft => {
      draft.items.sword.status = 'redHot';
    });
    if (swordCoolTimeoutRef.current !== null) {
      clearTimeout(swordCoolTimeoutRef.current); // Clear any previous cooldown
    }
    swordCoolTimeoutRef.current = setTimeout(coolSword, 5 * 1000); // Cool down after 5 seconds
  }

  function coolSword(): void {
    console.debug('cooling sword');
    setGameState(draft => {
      draft.items.sword.status = 'normal';
    });
  }

  const gameRef = useRef<HTMLDivElement | null>(null);

  const objectWithinBarrier = (x: number, y: number): boolean => {
    return (
      x > gameState.items.magicBarrier.location.x - gameState.items.magicBarrier.width / 2 &&
      x < gameState.items.magicBarrier.location.x + gameState.items.magicBarrier.width / 2 &&
      y > gameState.items.magicBarrier.location.y - gameState.items.magicBarrier.height / 2 &&
      y < gameState.items.magicBarrier.location.y + gameState.items.magicBarrier.height / 2
    );
  };

  const move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (gameRef.current !== null) {
      var rect = gameRef.current.getBoundingClientRect();
      let x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width - 20);
      let y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height - 20);

      if (
        y > windowSize.bottomGameYAxis - 40 &&
        x > windowSize.middleGameXAxis - 48 &&
        x < windowSize.middleGameXAxis + 48
      ) {
        console.debug('leaving game');
        leaveGame();
        return;
      } else {
        if (
          y > windowSize.bottomGameYAxis - 110 &&
          !(x > windowSize.middleGameXAxis - 48 && x < windowSize.middleGameXAxis + 48)
        ) {
          y = windowSize.bottomGameYAxis - 110; // prevent mouse from going off the bottom of the game
        }
        if (y < windowSize.topGameYAxis + 110) {
          y = windowSize.topGameYAxis + 110; // prevent mouse from going off the bottom of the game
        }
        if (x < windowSize.leftGameXAxis + 110) {
          x = windowSize.leftGameXAxis + 110; // prevent mouse from going off the left of the game
        }
        if (x > windowSize.rightGameXAxis - 110) {
          x = windowSize.rightGameXAxis - 110; // prevent mouse from going off the left of the game
        }
      }

      if (gameState.activeItem === 'sword') {
        if (gameState.items.magicBarrier.status === 'active') {
          if (!objectWithinBarrier(x, y)) {
            setGameState(draft => {
              draft.items.sword.location = {
                x: x,
                y: y,
              };
            });
          } else {
            console.debug('sword cannot enter the magic barrier');
            setGameState(draft => {
              draft.npcs.sage.alignment = 'annoyed';
            });
          }
        } else {
          setGameState(draft => {
            draft.items.sword.location = { x: x, y: y };
          });
        }
      } else if (gameState.activeItem === 'fairy') {
        if (!fairyMutex.isLocked()) {
          if (gameState.items.magicBarrier.status === 'active') {
            if (objectWithinBarrier(x, y) && gameState.npcs.fairy.status === 'alive') {
              console.debug('fairy can enter the magic barrier');
              disableSageBarrier();
              setGameState(draft => {
                draft.npcs.sage.alignment = 'good';
                draft.npcs.fairy.location = {
                  x: x,
                  y: y,
                };
              });
            } else {
              enableSageBarrier();
              setGameState(draft => {
                draft.npcs.fairy.location = {
                  x: x,
                  y: y,
                };
              });
            }
          } else {
            if (!objectWithinBarrier(x, y) && gameState.npcs.sage.status === 'alive') {
              enableSageBarrier();
            }
            setGameState(draft => {
              draft.npcs.fairy.location = { x: x, y: y };
            });
          }
        }
      } else if (gameState.activeItem === 'gun') {
        setGameState(draft => {
          draft.items.gun.location = { x: x, y: y };
        });
      }
    }
  };

  function windowIsTooSmall() {
    return mediumWindowThreshold > windowSize.windowThreshold;
  }

  function enterFlame() {
    gameState.activeItem === 'fairy' && burnFairy();
    gameState.activeItem === 'sword' && heatSword();
  }

  function leaveGame() {
    gameState.activeItem === 'sword' && leaveWithSword();
    gameState.activePC === 'link' && linkExit();
  }

  function leaveWithSword() {
    setGameState(draft => {
      draft.activeItem = '';
      draft.items.sword.status = 'stolen';
      draft.items.gun.status = 'available';
    });
  }

  function linkExit() {
    if (confirm('would you like to follow Link?')) {
      window.open('/HeroOfTime', '_blank');
    }
  }

  function shootGun() {
    console.debug('shooting gun');
    if (
      gameState.npcs.fairy.location.x + gameState.npcs.fairy.width / 2 >
        gameState.items.gun.location.x &&
      gameState.npcs.fairy.location.x - gameState.npcs.fairy.width / 2 <
        gameState.items.gun.location.x &&
      gameState.npcs.fairy.location.y + gameState.npcs.fairy.height / 2 >
        gameState.items.gun.location.y &&
      gameState.npcs.fairy.location.y - gameState.npcs.fairy.height / 2 <
        gameState.items.gun.location.y
    ) {
      setGameState(draft => {
        draft.npcs.fairy.status = 'dead';
      });
    }
    if (
      gameState.npcs.sage.location.x + gameState.npcs.sage.width / 2 >
        gameState.items.gun.location.x &&
      gameState.npcs.sage.location.x - gameState.npcs.sage.width / 2 <
        gameState.items.gun.location.x &&
      gameState.npcs.sage.location.y + gameState.npcs.sage.height / 2 >
        gameState.items.gun.location.y &&
      gameState.npcs.sage.location.y - gameState.npcs.sage.height / 2 <
        gameState.items.gun.location.y
    ) {
      setGameState(draft => {
        draft.npcs.sage.status = 'dead';
      });
    }
    if (
      gameState.npcs.link.location.x + gameState.npcs.link.width / 2 >
        gameState.items.gun.location.x &&
      gameState.npcs.link.location.x - gameState.npcs.link.width / 2 <
        gameState.items.gun.location.x &&
      gameState.npcs.link.location.y + gameState.npcs.link.height / 2 >
        gameState.items.gun.location.y &&
      gameState.npcs.link.location.y - gameState.npcs.link.height / 2 <
        gameState.items.gun.location.y
    ) {
      setGameState(draft => {
        draft.npcs.link.status = 'dead';
      });
    }
  }

  return (
    <div>
      {windowIsTooSmall() && (
        <div className="game-warning">
          <p>
            This game is best played on a larger screen with a mouse. Please resize your browser
            window.
          </p>
        </div>
      )}
      {!windowIsTooSmall() && (
        <>
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
              onMouseEnter={() => {}}
            >
              <StaticImage
                src="../images/dangerDanger.png"
                alt="words to live by"
                placeholder="blurred"
                height={60}
              />
            </div>
            {gameState.items.sword.status !== 'stolen' && (
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
                  src="../images/dangerSword.png"
                  alt="It's a dangerous gift"
                  placeholder="blurred"
                  height={40}
                  style={{
                    display: gameState.items.sword.status === 'normal' ? 'block' : 'none',
                  }}
                />
                <StaticImage
                  src="../images/dangerSwordRedHot.png"
                  alt="It's a dangerous gift"
                  placeholder="blurred"
                  height={40}
                  style={{
                    display: gameState.items.sword.status === 'redHot' ? 'block' : 'none',
                  }}
                />
              </div>
            )}

            {gameState.items.sword.status === 'stolen' && (
              <div
                className="cursor"
                style={{
                  left: gameState.items.gun.location.x,
                  top: gameState.items.gun.location.y,
                }}
                onClick={() => {
                  console.debug('gun/reticle clicked');
                  if (gameState.activeItem !== 'gun') {
                    console.debug('picking up the gun');
                    setGameState(draft => {
                      draft.activeItem = 'gun';
                      draft.items.gun.status = 'active';
                    });
                  } else {
                    shootGun();
                  }
                }}
              >
                <StaticImage
                  src="../images/dangerReticle.png"
                  alt="point and click reticle"
                  placeholder="blurred"
                  height={40}
                  style={{
                    display: gameState.items.gun.status === 'active' ? 'block' : 'none',
                  }}
                />
                <StaticImage
                  src="../images/dangerGun.png"
                  alt="It's a very dangerous gift"
                  placeholder="blurred"
                  height={40}
                  style={{
                    display: gameState.items.gun.status === 'available' ? 'block' : 'none',
                  }}
                />
              </div>
            )}

            <div
              className="game-item"
              style={{
                left: gameState.items.fire1.location.x,
                top: gameState.items.fire1.location.y,
              }}
              onClick={() => {}}
              onMouseEnter={() => {
                enterFlame();
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
                enterFlame();
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
                gameState.activeItem === 'sword' && killSage('sword');
                gameState.activeItem === 'fairy' &&
                  gameState.npcs.fairy.status === 'alive' &&
                  gameState.npcs.sage.status === 'dead' &&
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
            <div
              className="link-hero-of-time game-npc"
              style={{
                left: gameState.npcs.link.location.x,
                top: gameState.npcs.link.location.y,
                cursor: gameState.activeItem === 'sword' ? 'none' : 'default',
              }}
              onMouseEnter={() => {
                gameState.activeItem === 'sword' && killLink();
                gameState.activeItem === 'fairy' &&
                  gameState.npcs.fairy.status === 'alive' &&
                  reviveLink();
              }}
            >
              {gameState.npcs.link.status === 'alive' && (
                <StaticImage
                  src="../images/dangerLink.png"
                  alt="the hero of time"
                  placeholder="blurred"
                  height={50}
                />
              )}
              {gameState.npcs.link.status === 'dead' && (
                <Link
                  to={gameState.npcs.link.status === 'dead' ? '/DeadLink' : '/HeroOfTime'}
                  aria-label="Hero of Time link"
                >
                  <StaticImage
                    src="../images/dangerLink.png"
                    alt="the hero of time - dead"
                    placeholder="blurred"
                    transformOptions={{ rotate: -90 }}
                    style={{ display: gameState.npcs.link.status === 'dead' ? 'block' : 'none' }}
                    height={50}
                  />
                </Link>
              )}
            </div>
            <div
              className="cursor fairy-of-the-fountain"
              style={{
                left: gameState.npcs.fairy.location.x,
                top: gameState.npcs.fairy.location.y,
              }}
              onMouseEnter={() => {
                gameState.activeItem === 'sword' &&
                  gameState.npcs.fairy.status === 'alive' &&
                  killFairy();
              }}
            >
              <div
                onClick={() => {
                  if (gameState.activeItem !== 'fairy' && gameState.activeItem !== 'gun') {
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
                      gameState.npcs.link.status === 'dead' &&
                      gameState.npcs.fairy.status === 'alive'
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
        </>
      )}
    </div>
  );
};

export default Game;
