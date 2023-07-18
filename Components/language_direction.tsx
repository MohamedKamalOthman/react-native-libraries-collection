import {createContext, useState, useEffect, useContext} from 'react';
import {Button, Text} from 'react-native';

const LanguageDirectionContext = createContext({
  direction: 'ltr',
  toggleDirection: () => {},
});
const LanguageDirectionProvider = ({children}) => {
  const [direction, setDirection] = useState('ltr');

  const toggleDirection = () => {
    console.log('toggleDirection');
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  useEffect(() => {
    // use I18nManager to force direction and use asyncstorage to save the current direction to device.
  }, [direction]);

  return (
    <LanguageDirectionContext.Provider
      value={{
        direction,
        toggleDirection,
      }}>
      {children}
    </LanguageDirectionContext.Provider>
  );
};
const useDirection = () => {
  const context = useContext(LanguageDirectionContext);

  if (!context) {
    throw new Error('You forgot the language provider!');
  }

  return context;
};
const MyDirectionChangerButton = () => {
  const {toggleDirection} = useDirection();
  return <Button title="Change direction." onPress={toggleDirection} />;
};
const MyCustomTextComponent = ({children, style, ...rest}) => {
  const {direction} = useDirection();

  // i cant understand that the direction of text correct right now. maybe you dont need textAlign property.
  return (
    <Text
      style={[
        style,
        {
          writingDirection: direction,
          textAlign: direction === 'ltr' ? 'left' : 'right',
        },
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export {
  LanguageDirectionProvider,
  useDirection,
  MyDirectionChangerButton,
  MyCustomTextComponent,
};
