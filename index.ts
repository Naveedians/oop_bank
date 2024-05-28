#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";

// Customer class to hold customer details
class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    mobNumber: string;
    accNumber: string;

    constructor(
        fName: string,
        lName: string,
        age: number,
        gender: string,
        mob: string,
        acc: string
    ) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}

// Interface for bank account
interface BankAccount {
    accNumber: string;
    balance: number;
}

// Bank class to manage customers and accounts
class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];

    // Add customer to the bank
    addCustomer(obj: Customer) {
        this.customer.push(obj);
    }

    // Add account to the bank
    addAccountNumber(obj: BankAccount) {
        this.account.push(obj);
    }

    // Perform transaction by updating account balance
    transaction(accObj: BankAccount) {
        let newAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
        newAccounts.push(accObj);
        this.account = newAccounts;
    }
}

let myBank = new Bank();

// Create 3 sample customers and accounts
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = faker.phone.number("3##########");
    const cus = new Customer(fName, lName, 25 * i, "male", num, (1000 + i).toString());
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}

// Function to provide bank services through a command-line interface
async function bankService(bank: Bank) {
    while (true) {
        // Prompt user to select a service
        let service = await inquirer.prompt([{
            name: "select",
            type: "list",
            message: "Select an option",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        }]);

        // View Balance
        if (service.select === "View Balance") {
            let res = await inquirer.prompt([{
                name: "num",
                type: "input",
                message: "Please enter your account number"
            }]);
            let account = bank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            } else {
                let name = bank.customer.find((item) => item.accNumber == res.num);
                console.log(`Dear ${chalk.green.bold.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)}, your account balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }

        // Cash Withdraw
        if (service.select === "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Enter your account number"
            });
            let account = bank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            } else {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Please enter amount"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold.italic("Insufficient balance"));
                } else {
                    let newBalance = account.balance - ans.rupee;
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk.green.bold.italic(`Transaction successful! New balance is ${newBalance}`));
                }
            }
        }

        // Cash Deposit
        if (service.select === "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Enter your account number"
            });
            let account = bank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid account number"));
            } else {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Please enter amount"
                });
                let newBalance = account.balance + ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.green.bold.italic(`Transaction successful! New balance is ${newBalance}`));
            }
        }

        // Exit
        if (service.select === "Exit") {
            break;
        }
    }
}

// Start the bank service
bankService(myBank);
