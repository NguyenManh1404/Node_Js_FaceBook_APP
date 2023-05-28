import React from 'react';
import { List } from 'admin-bro';

const MyList = (props) => {
    const { resource, data } = props;

    const handleClick = (event, record) => {
        // Handle the click event if needed
        // ...
        alert("asd")
    };

    return (
        <List {...props}>
            <List.Table>
                <List.TableBody>
                    {data.map((record) => (
                        <List.TableRow key={record.id} onClick={(e) => handleClick(e, record)}>
                            {resource.listProperties.map((property) => (
                                <List.TableCell key={property.name}>
                                    {property.render(record.params[property.name], record)}
                                </List.TableCell>
                            ))}
                        </List.TableRow>
                    ))}
                </List.TableBody>
            </List.Table>
        </List>
    );
};

export default MyList;
