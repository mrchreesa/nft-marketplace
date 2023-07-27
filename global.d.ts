interface CustomWindow extends Window {
    ethereum?: any; // Adjust the type as needed
  }
  interface Window {
    ethereum?: any; // Adjust the type as needed
  }
  
  declare global {
    interface Window extends CustomWindow {}
  }
  