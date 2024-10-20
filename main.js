import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("emulator-container");
  const saveStateBtn = document.getElementById("saveStateBtn");
  const loadStateBtn = document.getElementById("loadStateBtn");
  
  let skyEmu;

  // Initialize SkyEmu
  SkyEmu.init({
    element: container,
    system: 'nds',
    bios: {
      arm7: '/bios/bios7.bin',
      arm9: '/bios/bios9.bin',
      firmware: '/bios/firmware.bin'
    },
    onReady: () => {
      console.log("SkyEmu is ready");
      // Load your ROM here
      skyEmu.loadROM('prueba.nds');
    }
  }).then(instance => {
    skyEmu = instance;
  });

  // Function to save the game state
  function saveGameState() {
    if (skyEmu && skyEmu.saveState) {
      const state = skyEmu.saveState();
      const stateObj = {
        state: state,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('ndsGameState', JSON.stringify(stateObj));
      console.log("Game state saved");
    } else {
      console.error("saveState method not available");
    }
  }

  // Function to load the game state
  function loadGameState() {
    const savedStateJSON = localStorage.getItem('ndsGameState');
    if (savedStateJSON && skyEmu && skyEmu.loadState) {
      try {
        const stateObj = JSON.parse(savedStateJSON);
        skyEmu.loadState(stateObj.state);
        console.log("Game state loaded from", stateObj.timestamp);
      } catch (error) {
        console.error("Error loading game state:", error);
      }
    } else {
      console.log("No saved state found or loadState method not available");
    }
  }

  // Save state button event listener
  saveStateBtn.addEventListener('click', saveGameState);

  // Load state button event listener
  loadStateBtn.addEventListener('click', loadGameState);

  // Save the state before closing the page
  window.addEventListener('beforeunload', saveGameState);
});