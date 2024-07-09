import { useState, useRef, useEffect } from 'react'
import { getCSSColorVariables, MantineProvider, createTheme, ColorInput, Group, Box, Text, Divider, Stack, Button, useMantineColorScheme, ActionIcon, Flex } from '@mantine/core'
import { generateColorsMap, generateColors } from '@mantine/colors-generator'
import { IconSun, IconMoonStars } from '@tabler/icons-react';

const getNumberFromString = (str) => Number(str.match(/(\d+)/)[0])

const isValidHex = (color) =>{
  if(!color || typeof color !== 'string') return false;

  // Validate hex values
  if(color.substring(0, 1) === '#') color = color.substring(1);

  switch(color.length) {
    case 3: return /^[0-9A-F]{3}$/i.test(color);
    case 6: return /^[0-9A-F]{6}$/i.test(color);
    case 8: return /^[0-9A-F]{8}$/i.test(color);
    default: return false;
  }
}

function App() {
  // -- input color --
  const [color, setColor] = useState('#f36f20');
  const prevColor = useRef('#f36f20')

  const resolveCSSVars = () => {
    const baseColor = isValidHex(color) ? color : prevColor.current

    // 1. Get correct base color index
    //    in order to use it as primaryShade for color
    const { baseColorIndex, colors } = generateColorsMap(baseColor)
    const hexColors = colors.map(c => c.hex())
    hexColors[baseColorIndex] = baseColor
  
    // 2. Generate CSS vars with correct base color & primaryShade
    // ref: https://github.com/mantinedev/mantine/blob/2f91229da10d30a205ade277161bc8829740bd93/packages/%40mantine/core/src/core/MantineProvider/MantineCssVariables/get-css-color-variables.ts#L12
    const cssVarsForLightMode = getCSSColorVariables({
      theme: {
        colors: { primary: hexColors },
        primaryShade: baseColorIndex,
      },
      color: 'primary',
      colorScheme: 'light',
      name: 'primary',
      withColorValues: false,
    })
    const cssVarsForDarkMode = getCSSColorVariables({
      theme: {
        colors: { primary: hexColors },
        primaryShade: baseColorIndex,
      },
      color: 'primary',
      colorScheme: 'dark',
      name: 'primary',
      withColorValues: false,
    })

    return {
      variables: {
        [`--mantine-color-primary-${baseColorIndex}`]: baseColor
      },
      light: cssVarsForLightMode,
      dark: cssVarsForDarkMode,
    }
  }
  
  const getColors = () => {
    const baseColor = isValidHex(color) ? color : prevColor.current

    const { baseColorIndex, colors } = generateColorsMap(baseColor)
    const hexColors = colors.map(c => c.hex())
    hexColors[baseColorIndex] = baseColor
  
    const { light, dark } = resolveCSSVars(baseColor)
    console.log({light, dark})
    return {
      baseColorIndex,
      colors: hexColors,
      lightColors: {
        filled: hexColors[getNumberFromString(light['--mantine-color-primary-filled'])],
        filledHover: hexColors[getNumberFromString(light['--mantine-color-primary-filled-hover'])],
        light: light['--mantine-color-primary-light'],
        lightColor: hexColors[getNumberFromString(light['--mantine-color-primary-light-color'])],
        lightHover: light['--mantine-color-primary-light-hover'],
        outline: hexColors[getNumberFromString(light['--mantine-color-primary-outline'])],
        outlineHover:light['--mantine-color-primary-outline-hover'],
        text: hexColors[getNumberFromString(light['--mantine-color-primary-filled'])],
      },
      darkColors: {
        filled: hexColors[getNumberFromString(dark['--mantine-color-primary-filled'])],
        filledHover: hexColors[getNumberFromString(dark['--mantine-color-primary-filled-hover'])],
        light: dark['--mantine-color-primary-light'],
        lightColor: hexColors[getNumberFromString(dark['--mantine-color-primary-light-color'])],
        lightHover: dark['--mantine-color-primary-light-hover'],
        outline: hexColors[getNumberFromString(dark['--mantine-color-primary-outline'])],
        outlineHover:dark['--mantine-color-primary-outline-hover'],
        text: hexColors[getNumberFromString(dark['--mantine-color-primary-text'])],
      },
    }
  }

  // -- output colors --
  const {
    baseColorIndex,
    colors: defaultColors,
    lightColors,
    darkColors,
  } = getColors()

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const displayColors = colorScheme === 'dark' ? darkColors : lightColors

  useEffect(() => {
    if (isValidHex(color)) {
      prevColor.current = color
    }
  }, [color])

  return (
    <MantineProvider 
      theme={createTheme({
        colors: {
          primary: generateColors(isValidHex(color) ? color : prevColor.current),
        },
        primaryColor: 'primary',
        colorScheme,
      })}
      cssVariablesResolver={resolveCSSVars}
    >
      <div className="App">
        {/* color input */}
        <ColorInput style={{ width: 'fit-content' }} label="Input color" value={color} onChange={setColor} />

        <Flex my="md" align="center">
          <ActionIcon
            variant="outline"
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {colorScheme === 'dark' ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
          <Text ml="xs" onClick={() => toggleColorScheme()}>Toggle to see in light/dark mode</Text>
        </Flex>

        {/* list colors */}
        <Group mt="md">
          {defaultColors.map((curColor, idx) => (
            <div key={idx}>
              <Box key={idx} style={{ width: '100px', height: '100px', background: curColor }} />
              <Text ta="center">{curColor}</Text>
              <Text ta="center">{idx} {idx === baseColorIndex ? '(base)': ''}</Text>
            </div>
          ))}
        </Group>

        <Stack>
          <Flex align="center">
            <Button variant="filled" style={{ width: 'fit-content' }}>Filled button</Button>
            <Text ml="xs">Background: {displayColors.filled}, hover: {displayColors.filledHover}</Text>
          </Flex>
          
          <Flex align="center">
            <Button variant="light" style={{ width: 'fit-content' }}>Light button</Button>
            <Text ml="xs">Background: {displayColors.light}, hover: {displayColors.lightHover}, text color: {displayColors.lightColor}</Text>
          </Flex>

          <Flex align="center">
            <Button variant="outline" style={{ width: 'fit-content' }}>Outline button</Button>
            <Text ml="xs">Background: {displayColors.outline}, hover: {displayColors.outlineHover}</Text>
          </Flex>

          <Flex align="center">
            <Button variant="subtle" style={{ width: 'fit-content' }}>Subtle button</Button>
            <Text ml="xs">Background: transparent, hover: {displayColors.lightHover}, text color: {displayColors.lightColor}</Text>
          </Flex>

          <Flex align="center">
            <Text>Text:</Text>
            <Text ml="xs">{displayColors.text}</Text>
          </Flex>
        </Stack>
      </div>
    </MantineProvider>
  );
}

export default App;
