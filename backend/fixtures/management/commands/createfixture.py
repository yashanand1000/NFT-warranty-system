from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from fixtures.userfixture import RetailerFactory, OwnerFactory
from fixtures.productfixture import ItemFactory, ProductFactory


class Command(BaseCommand):
    help = 'Generates dummy data for testing purposes'

    def handle(self, *args, **options):
        if settings.DEBUG:
            self.create_fixtures()
        else:  # pragma: no cover
            self.stdout.write("This command is only available for DEBUG=True")
            self.stdout.write("Abort")

    def create_fixtures(self):
        self.create_objects(RetailerFactory)
        self.create_objects(OwnerFactory)
        self.create_objects(ProductFactory, object_count=50)
        self.create_objects(ItemFactory, object_count=100)

    @staticmethod
    def create_objects(klass=None, object_count=5, m2m=False):
        if klass is not None and m2m is False:
            for i in range(object_count):
                try:
                    klass.create()
                except IntegrityError:  # pragma: no cover
                    pass
        else:
            raise ValueError("klass argument cannot be null")
