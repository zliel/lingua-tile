import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Grid, Link, List, ListItemText, TextField, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";

function RecipeScraper() {
    const [recipeUrl, setRecipeUrl] = useState("https://www.justonecookbook.com/tonkatsu/");
    const [recipe, setRecipe] = useState({ingredients: ["2  boneless pork loin chops (½ inch thick)","½ tsp kosher salt (Diamond Crystal; use half for table salt)","⅛ tsp freshly ground black pepper","3 cups neutral-flavored oil (vegetable, rice bran, canola, etc.)","2 Tbsp all-purpose flour (plain flour)","1  large egg (50 g w/o shell)","½ Tbsp neutral-flavored oil (vegetable, rice bran, canola, etc.)","½ cup panko (Japanese breadcrumbs)","¼ head cabbage","1  Persian or Japanese cucumber","2 Tbsp Japanese sesame dressing","1 Tbsp toasted white sesame seeds","1 Tbsp toasted black sesame seeds","4 Tbsp tonkatsu sauce"], url: "https://www.justonecookbook.com/tonkatsu/"})
    const [shoppingList, setShoppingList] = useState([]);


    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await axios.get(`http://localhost:8000/scrape?url=${recipeUrl}`)
            setRecipe(response.data)
        }

        fetchIngredients()
    }, [recipeUrl]);

    const handleInputChange = (e) => {
        setRecipeUrl(e.target.value)
    }

    const addToShoppingList = () => {
        for(let arr in shoppingList) {
            if(recipe.ingredients === shoppingList[arr]) {
                return
            }
        }

        setShoppingList([...shoppingList, recipe.ingredients])
    }

    return (
        <Grid container alignSelf={"center"} justify={"center"} direction={"column"} gap={2} paddingTop={"0.5em"}>
            <Grid item>
                <TextField id={"recipe-url-input"}
                           name={"recipe-url"}
                           label={"Recipe URL"}
                           type={"text"}
                           value={recipeUrl}
                           onChange={handleInputChange}
                           fullWidth={true}
                />
            </Grid>
            <Grid item>
                <Typography variant={"h6"}>Ingredients</Typography>
                <List>
                {recipe.ingredients.map((ingredient) => {
                    return <ListItemText primary={ingredient} key={ingredient}/>
                })}
                </List>
                <Typography variant={"h6"}>URL: <Link href={recipe.url} target={"_blank"}>{recipe.url}</Link></Typography>
            </Grid>
            <Grid item>
                <Button variant={"outlined"} onClick={addToShoppingList}><Add /> Add to shopping list</Button>
                <List>
                {shoppingList.map((list) => {
                    return list.map((item) => {
                        return <ListItemText primary={item} key={item}/>
                    })
                })}
                </List>
            </Grid>
        </Grid>
    );
}

export default RecipeScraper;