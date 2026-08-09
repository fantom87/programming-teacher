// The transaction script — ready once your class exists:
BankAccount account = new BankAccount();
account.Deposit(50);
account.Deposit(-10);
account.Withdraw(20);
account.Withdraw(100);
Console.WriteLine($"Final balance: {account.Balance}");

// Build BankAccount below:
//   private double balance;               <- the secret
//   public double Balance => balance;     <- read-only window
//   Deposit(double amount)  — reject amount <= 0, else add + print
//   Withdraw(double amount) — reject amount > balance, else subtract + print
