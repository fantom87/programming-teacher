BankAccount account = new BankAccount();
account.Deposit(50);
account.Deposit(-10);
account.Withdraw(20);
account.Withdraw(100);
Console.WriteLine($"Final balance: {account.Balance}");

class BankAccount
{
    private double balance;

    public double Balance => balance;

    public void Deposit(double amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine($"Rejected deposit of {amount}.");
            return;
        }
        balance += amount;
        Console.WriteLine($"Deposited {amount}. Balance: {balance}");
    }

    public void Withdraw(double amount)
    {
        if (amount > balance)
        {
            Console.WriteLine($"Rejected withdrawal of {amount}.");
            return;
        }
        balance -= amount;
        Console.WriteLine($"Withdrew {amount}. Balance: {balance}");
    }
}
